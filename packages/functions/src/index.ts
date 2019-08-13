import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as sharp from 'sharp';
import { Bucket } from '@google-cloud/storage';

async function resizeImage(image: Buffer, size: number): Promise<Buffer> {
  return sharp(image)
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

// Without credentials. Triggers already have sufficient credentials
const app = admin.initializeApp();

export const onDeleteArtist = functions.firestore
  .document('users/{userId}/artists/{artistId}')
  .onDelete((snapshot, context) => {
    const userId = context.params.userId;
    const data = snapshot.data();
    if (data && data.imageId) {
      return app.firestore()
        .doc(`users/${userId}/images/${data.imageId}`)
        .delete();
    }
    return;
  });

function deleteFile(bucket: Bucket, filePath: string): Promise<any> {
  return bucket.file(filePath)
    .delete()
    .catch((err) => console.log(`Error while deleting ${filePath}`, err));
}

export const onDeleteImage = functions.firestore
  .document('users/{userId}/images/{imageId}')
  .onDelete((snapshot, context) => {
    const data = snapshot.data();
    if (!data) {
      return;
    }

    const bucket = app.storage().bucket();
    const promises: Promise<any>[] = [];
    if (data.path) {
      promises.push(deleteFile(bucket, data.path));
    }

    if (data.thumbnails && data.thumbnails.thumb300) {
      promises.push(deleteFile(bucket, data.thumbnails.thumb300));
    }

    return Promise.all(promises);
  });

export const thumbnailGenerator = functions.storage
  .bucket()
  .object()
  .onFinalize(
    async (metadata, context) => {
      const filePath = metadata.name;
      if (!metadata.contentType || !metadata.contentType.startsWith('image/') || !filePath) {
        console.log(`File ${filePath} is not an image`);
        return;
      }

      const fileName = path.basename(filePath);
      if (fileName.startsWith('thumb_')) {
        console.log(`File ${filePath} is already a thumbnail`);
        return;
      }

      if (!metadata.metadata || !metadata.metadata.entity) {
        console.log(`File ${filePath} without associated entity`);
        return;
      }

      const entity = metadata.metadata.entity;
      const bucket = app.storage().bucket(metadata.bucket);
      const buffer = await bucket.file(filePath).download();
      if (!buffer.length) {
        console.log(`Cannot download file ${filePath}`);
        return;
      }

      const image = buffer[0];
      const resized = await resizeImage(image, 300);

      const thumbnailPath = path.join(path.dirname(filePath), `thumb_300_${fileName}`);
      console.log(`Thumbnail for file ${filePath} will be placed in ${thumbnailPath}`);
      return bucket.file(thumbnailPath)
        .save(resized, {
          contentType: metadata.contentType,
          metadata: { entity }
        })
        .then(() => {
          console.log(`Thumbnail for file ${filePath} was uploaded`);
          return app.firestore().doc(entity).update({
            thumbnails: {
              thumb300: thumbnailPath
            }
          });
        })
        .catch(err =>
          console.log(`Cannot upload thumbnail for file ${filePath}`)
        );
    }
  );
