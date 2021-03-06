import { Request, Response, Router } from 'express';
import * as admin from 'firebase-admin';
import * as fireStorage from '@google-cloud/storage';
import * as fs from 'fs';
import * as request from 'request';
import * as sharp from 'sharp';
import { sharedEnvironment } from '@muslib/shared';

const fireApp = admin.initializeApp({
  storageBucket: sharedEnvironment.firebase.storageBucket
});

interface BucketDump {
  bucket: string;
  files: string[];
}

interface StorageDump {
  buckets: BucketDump[];
}

function dumpStorage(storage1: fireStorage.Storage): Promise<StorageDump> {
  function dumpBucket(bucket: fireStorage.Bucket): Promise<BucketDump> {
    return bucket.getFiles().then(files => {
      const fileNames = files[0].map(f => f.name);
      return { bucket: bucket.name, files: fileNames };
    });
  }

  function dumpBuckets(buckets: fireStorage.Bucket[]): Promise<BucketDump>[] {
    return buckets.map(bucket => {
      return dumpBucket(bucket);
    });
  }

  return storage1
    .getBuckets()
    .then(bucketsRes => {
      return Promise.all(dumpBuckets(bucketsRes[0]));
    })
    .then((bucketDumps: BucketDump[]) => {
      return { buckets: bucketDumps };
    });
}

function requestBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    request(url, { encoding: null }, (error, res, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

async function resizeImage(image: Buffer, size: number): Promise<Buffer> {
  return sharp(image)
    .resize(size, size, { fit: 'inside' })
    .png()
    .toBuffer();
}

async function uploadImage(path: string, image: Buffer): Promise<Buffer> {
  console.log('Uploading image. Path:', path);
  await fireApp
    .storage()
    .bucket()
    .file(path)
    .save(image);
  console.log('Uploading completed. Path:', path);
  return image;
}

// https://lastfm-img2.akamaized.net/i/u/ar0/d2fbaffb73bf1a0250ec0517f1587963

const storage: fireStorage.Storage = new fireStorage.Storage();
export const route = Router();

async function getImage(req: Request): Promise<Buffer> {
  if (req.is('image/*')) {
    if (req.body) {
      return Promise.resolve(req.body);
    }
  } else if (req.is('application/json') && req.body && req.body.url) {
    return requestBuffer(req.body.url);
  }

  throw new Error('Unsupported request type');
}

function saveBuffer(image: Buffer, filePath: string): Promise<Buffer> {
  fs.createWriteStream(filePath).write(image);
  return Promise.resolve(image);
}

function getIdToken(req: Request): string {
  if (!req.headers.authorization) {
    throw Error('Authorization header missing');
  }
  const parts = req.headers.authorization.split(' ');
  console.log('idtoken parts', parts);
  if (parts.length !== 2) {
    throw Error('Invalid authorization header');
  }

  return parts[1];
}

async function getUserId(req: Request): Promise<string> {
  const useAuth = true;
  if (useAuth) {
    const decoded = await fireApp.auth().verifyIdToken(getIdToken(req));
    return decoded.uid;
  } else {
    return Promise.resolve('debug_user_id');
  }
}

function buildImagePath(userId: string, path: string, suffix: string): string {
  return `users/${userId}/${path}_${suffix}`;
}

async function processUpload(
  req: Request,
  res: Response,
  path: string,
  sizes?: number[]
): Promise<void> {
  try {
    const userId: string = await getUserId(req);
    const image: Buffer = await getImage(req);
    const promises: Promise<any>[] = [];
    promises.push(uploadImage(buildImagePath(userId, path, 'main'), image));

    if (sizes) {
      for (const size of sizes) {
        const resized: Buffer = await resizeImage(image, size);
        promises.push(
          uploadImage(buildImagePath(userId, path, size.toString()), resized)
        );
      }
    }

    await Promise.all(promises);
    res.sendStatus(200);
  } catch (e) {
    console.log('Error while uploading image\n', e);
    res.sendStatus(500);
  }
}

route.get('/dump_storage', (req, res) => {
  console.log('/dump_storage request', req);
  dumpStorage(storage)
    .then(dump => {
      res.send(dump);
    })
    .catch(err => {
      res.sendStatus(500);
      console.log('Error while dump storage.\n', err);
    });
});

route.post('/images/artists/:artistId', async (req, res, next) => {
  console.log('Request uploading image');
  await processUpload(
    req,
    res,
    `artists/${req.params.artistId}/${req.params.artistId}`,
    [300]
  );
});

route.post(
  '/images/artists/:artistId/albums/:albumId',
  async (req, res, next) => {
    await processUpload(
      req,
      res,
      `artists/${req.params.artistId}/albums/${req.params.albumId}/${req.params.albumId}`,
      [300, 96]
    );
  }
);
