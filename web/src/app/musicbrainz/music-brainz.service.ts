import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { Album } from './models/album';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { catchError, map, publishReplay, refCount } from 'rxjs/operators';

export interface MusicBrainzConfig {
  baseUrl: string;
}

export const MUSIC_BRAIN_CONFIG = new InjectionToken('MusicBrainz config');

export const MusicBrainzDefConfig: MusicBrainzConfig = {
  baseUrl: 'http://musicbrainz.org/ws/2'
};

interface AlbumResponse {
  id: string;
  title: string;
  date: string;
  'primary-type': string;
}

interface ReleaseGroupsResponse {
  'release-groups': AlbumResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class MusicBrainzService {
  // http://musicbrainz.org/ws/2/artist/0f6df3f2-01f5-4d9a-a047-a76c907d7b66?inc=release-groups&fmt=json

  constructor(
    private http: HttpClient,
    @Optional() @Inject(MUSIC_BRAIN_CONFIG) private config: MusicBrainzConfig
  ) {
    if (!config) {
      this.config = MusicBrainzDefConfig;
    }
  }

  private getRequest<T, R>(
    url: string,
    params: HttpParams,
    mapper: (value: T) => R
  ): Observable<R> {
    return this.http.get<T>(url, { params }).pipe(
      map(mapper, this),
      catchError(err => this.handleError(err)),
      publishReplay(1),
      refCount()
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('[UserApi] handleError():', error);
    if (error.error instanceof ErrorEvent) {
      return throwError(new Error(error.error.error));
    } else if (error.error && error.error.message) {
      return throwError(new Error(error.error.message));
    } else {
      return throwError(new Error(error.statusText));
    }
  }

  getAlbums(mbid: string): Observable<Album[]> {
    if (!mbid) {
      console.log(mbid);
      return EMPTY;
    }
    const params = new HttpParams()
      .append('fmt', 'json')
      .append('inc', 'release-groups');
    const url = this.config.baseUrl + '/artist/' + mbid;
    return this.getRequest(url, params, this.buildAlbums);
  }

  private buildAlbums(response: ReleaseGroupsResponse): Album[] {
    return response['release-groups'].map(albumResponse => {
      return new Album(
        albumResponse.id,
        albumResponse.title,
        albumResponse.date,
        albumResponse['primary-type']
      );
    });
  }
}
