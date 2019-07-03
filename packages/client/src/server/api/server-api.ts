import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { MBApi } from './mb-api';
import { sharedEnvironment } from 'muslib/shared';

async function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (_: ProgressEvent) => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Reader result must be a ArrayBuffer.'));
      }
    };
    reader.onloadend = (ev: ProgressEvent) => {
      if (ev.loaded !== ev.total) {
        reject(new Error('Not all content can be readed.'));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

class MuslibApiUploadHandler {
  constructor(private http: HttpClient) {}

  async image(path: string, image: File): Promise<void> {
    const content = await readFile(image);
    const url = sharedEnvironment.server.url + '/images/' + path;
    try {
      await this.http
        .post(url, content, {
          headers: { 'Content-Type': image.type },
          responseType: 'arraybuffer'
        })
        .pipe(take(1))
        .toPromise();
    } catch (err) {
      console.log('Error while uploading file\n', err);
    }
  }

  async url(path: string, imageUrl: string): Promise<void> {
    const url = sharedEnvironment.server.url + '/images/' + path;
    try {
      console.log(`Upload image from ${imageUrl} to ${path}`);
      await this.http
        .post(url, JSON.stringify({ url: imageUrl }), {
          headers: { 'Content-Type': 'application/json' }
        })
        .pipe(take(1))
        .toPromise();
    } catch (err) {
      console.log('Error while uploading file from URL\n', err);
    }
  }
}

@Injectable()
export class MuslibApi {
  private readonly uploadHandler: MuslibApiUploadHandler;
  private readonly mMb2: MBApi;

  constructor(private http: HttpClient) {
    this.uploadHandler = new MuslibApiUploadHandler(this.http);
    this.mMb2 = new MBApi(this.http);
  }

  get upload(): MuslibApiUploadHandler {
    return this.uploadHandler;
  }

  get mb2(): MBApi {
    return this.mMb2;
  }
}
