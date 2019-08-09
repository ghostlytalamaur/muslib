import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as sharp from 'sharp';

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
    // console.log('onDeleteArtist executed. snapshot:', snapshot, 'context:', context);
    const id = snapshot.id;
    const userId = context.params.userId;
    const bucket = app.storage().bucket();
    return bucket.deleteFiles({ prefix: `users/${userId}/artists/${id}` });
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
          contentType: metadata.contentType
        })
        .then(() =>
          console.log(`Thumbnail for file ${filePath} was uploaded`)
        )
        .catch(err =>
          console.log(`Cannot upload thumbnail for file ${filePath}`)
        );
    }
  );
