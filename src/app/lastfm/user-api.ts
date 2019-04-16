import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {LastFmConfig} from './last-fm-config';
import {Observable, throwError} from 'rxjs';
import {catchError, map, publishReplay, refCount, shareReplay} from 'rxjs/operators';
import {User} from './user';
import {ImageResponse, TopArtistsResponse, UserInfoResponse} from './last-fm-response';
import {UserInfo} from './models/user-info';
import {Artist} from './models/artist';
import {TopArtists} from './models/top-artists';
import {of} from 'rxjs/internal/observable/of';


export interface UserTopArtistParams {
  // The time period over which to retrieve top artists for.
  period?: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

  // The number of results to fetch per page. Defaults to 50.
  limit?: number;

  // The page number to fetch. Defaults to first page.
  page?: number;
}

export class UserApi {

  constructor(private http: HttpClient,
              private config: LastFmConfig) {
  }

  private buildParams(user?: User): HttpParams {
    let params = new HttpParams()
      .append('api_key', this.config.apiKey)
      .append('format', 'json');
    if (user) {
      console.log('[UserApi] buildParams for user', user);
      params = params.append('user', user.login);
    }

    return params;
  }

  getRequest<T, R>(params: HttpParams, mapper: (value: T) => R): Observable<R> {
    return this.http.get<T>(this.config.baseUrl, {params}).pipe(
      map(mapper, this),
      catchError(err => this.handleError(err)),
      publishReplay(1),
      refCount()
    );
  }

  getInfo(user: User): Observable<UserInfo> {
    const params = this.buildParams(user)
      .append('method', 'user.getInfo');

    return this.getRequest(params, this.buildUserInfo);
    // return this.getRequest<UserInfoResponse, UserInfo>(params, r => this.buildUserInfo(r));
  }

  getTopArtists(user: User, params?: UserTopArtistParams): Observable<TopArtists> {
    let httpParams = this.buildParams(user)
      .append('method', 'user.getTopArtists');
    if (params) {
      if (params.limit) {
        httpParams = httpParams.append('limit', String(params.limit));
      }
      if (params.page) {
        httpParams = httpParams.append('page', String(params.page));
      }
      if (params.period) {
        httpParams = httpParams.append('period', String(params.period));
      }
    }
    return this.getRequest<TopArtistsResponse, TopArtists>(httpParams, this.buildTopArtists);
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

  private extractImage(images: ImageResponse[]): Observable<string> {
    const img = images.find((value) => value.size === 'extralarge');
    return of(img ? img['#text'] : '');
  }

  private buildTopArtists(response: TopArtistsResponse): TopArtists {
    console.log('[UserApi]', response);
    return new TopArtists(
      response.topartists['@attr'].page,
      response.topartists['@attr'].total,
      response.topartists.artist.map(artistResponse =>
        new Artist(artistResponse.mbid, artistResponse.name, this.extractImage(artistResponse.image)))
    );
  }

  private buildUserInfo(response: UserInfoResponse): UserInfo {
    return new UserInfo(response.user.name, response.user.url, ''); //this.extractImage(response.user.image));
  }
}

