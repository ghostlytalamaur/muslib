import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { MBApi } from './mb-api';

import { AuthService } from '../../app/auth/auth.service';
import { sharedEnvironment } from '@muslib/shared';

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

interface UploadResponse {
  id: string;
}

interface FileUrlResponse {
  url: string;
}

class MuslibApiUploadHandler {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  async upload(image: File | string): Promise<string> {
    const user = this.authService.user;
    if (!user) {
      return Promise.reject(new Error('Not authenticated'));
    }

    let url = sharedEnvironment.server.url + '/storage/upload/';
    let content;
    let contentType: string;
    if (image instanceof File) {
      content = await readFile(image);
      contentType = image.type;
      url = url + `blob/${user.uid}`;
    } else {
      content = JSON.stringify({ url: image });
      contentType = 'application/json';
      url = url + `url/${user.uid}`;
    }
    return this.http
      .post<UploadResponse>(url, content, {
        headers: { 'Content-Type': contentType }
      })
      .pipe(
        map(response => response.id)
      )
      .toPromise();
  }

  getImageUrl(id: string): Promise<string> {
    const user = this.authService.user;
    if (!user) {
      return Promise.reject(new Error('Not authenticated'));
    }

    const url = sharedEnvironment.server.url + `/storage/url/${user.uid}`;
    const params = new HttpParams().set('id', id);
    return this.http
      .get<FileUrlResponse>(url, { params })
      .pipe(
        map(response => response.url)
      )
      .toPromise();
  }

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

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    this.uploadHandler = new MuslibApiUploadHandler(http, authService);
    this.mMb2 = new MBApi(http);
  }

  get upload(): MuslibApiUploadHandler {
    return this.uploadHandler;
  }

  get mb2(): MBApi {
    return this.mMb2;
  }
}
