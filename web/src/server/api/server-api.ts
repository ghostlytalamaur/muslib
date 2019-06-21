import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

interface MBSearchOptions {
  name: string;
}

interface MBArtist {
  id: string;
  name: string;
}

interface ArtistSearchResult {
  artists: MBArtist[];
}

function isMBArtist(artist: any): artist is MBArtist {
  return artist && (typeof artist.id === 'string') &&
    (typeof artist.name === 'string');
}

function isArrayOfMBArtist(arr: any): arr is Array<MBArtist> {
  if (Array.isArray(arr)) {
    const first = arr.length > 0 ? arr[0] : undefined;
    return !first || isMBArtist(first);
  } else {
    return false;
  }
}

function isValidArtistsSearchResult(response: ArtistSearchResult): response is ArtistSearchResult {
  if (response && Array.isArray(response.artists)) {
    return isArrayOfMBArtist(response.artists);
  } else {
    return false;
  }
}
class MusicBrainzHandler {
  constructor(private http: HttpClient) {
  }

  async search(options: MBSearchOptions): Promise<ArtistSearchResult> {
    const url = `${environment.server.url}/search/artist`;
    const params = new HttpParams()
      .append('name', options.name);
    const result = await this.http.get<ArtistSearchResult>(url, {params})
      .pipe(
        take(1),
        tap(artists => {
          if (!isValidArtistsSearchResult(artists)) {
            throw new Error('Invalid server response');
          }
        })
      )
      .toPromise();
    console.log('MusicBrainzHandler.search result', result);
    return Promise.resolve(result);
  }
}

@Injectable()
export class MuslibApi {
  private uploadHandler: MuslibApiUploadHandler;
  private mbHandler: MusicBrainzHandler;

  constructor(private http: HttpClient) {
  }

  get upload(): MuslibApiUploadHandler {
    if (!this.uploadHandler) {
      this.uploadHandler = new MuslibApiUploadHandler(this.http);
    }
    return this.uploadHandler;
  }

  get mb(): MusicBrainzHandler {
    if (!this.mbHandler) {
      this.mbHandler = new MusicBrainzHandler(this.http);
    }
    return this.mbHandler;
  }
}
