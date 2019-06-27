import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MBApi } from './mb-api';

async function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent) => {
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
    const url = environment.server.url + '/images/' + path;
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
    const url = environment.server.url + '/images/' + path;
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
  private uploadHandler: MuslibApiUploadHandler;
  private mMb2: MBApi;

  constructor(private http: HttpClient) {
  }

  get upload(): MuslibApiUploadHandler {
    if (!this.uploadHandler) {
      this.uploadHandler = new MuslibApiUploadHandler(this.http);
    }
    return this.uploadHandler;
  }

  get mb2(): MBApi {
    if (!this.mMb2) {
      this.mMb2 = new MBApi(this.http);
    }
    return this.mMb2;
  }
}
