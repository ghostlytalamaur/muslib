import { Request, Response, Router } from 'express';
import { Observable, Subscriber, throwError, timer } from 'rxjs';
import { map, retryWhen, switchMap, take } from 'rxjs/internal/operators';
import { ArtistSearchResult, compareByYear, ReleaseGroup, ReleaseGroupsResult, ReleaseType } from '@muslib/shared';
import * as rq from 'request';

export const route = Router();

interface ArtistSearchResponse {
  artists: {
    id: string;
    name: string;
  }[];
}

interface ReleaseGroupResponse {
  id: string;
  title: string;
  'primary-type': ReleaseType;
  'first-release-date': string;
  'primary-type-id': string;
  disambiguation: string;
  'secondary-types': string[];
  'secondary-type-ids': string[];
}

interface ReleaseGroupsResponse {
  'release-groups': ReleaseGroupResponse[];
}

interface CoverArtResponse {
  images: {
    edit: number,
    id: number,
    image: string,
    thumbnails: { [key: string]: string },
    comment: string;
    approved: boolean,
    front: boolean,
    types: string[],
    back: boolean
  }[];
}

function extractYear(date: string): number {
  return new Date(date).getFullYear();
}

function artistSearchResponseToResult(response: ArtistSearchResponse): ArtistSearchResult {
  const result: ArtistSearchResult = { artists: [] };
  const processedIds = new Set<string>();
  for (const a of response.artists) {
    if (!processedIds.has(a.id)) {
      processedIds.add(a.id);

      result.artists.push({ name: a.name, id: a.id });
    }
  }
  return result;
}

const config = {
  endpoint: 'https://musicbrainz.org/ws/2',
  appName: 'muslib',
  appVersion: '0.1',
  appMail: 'sample@mail.net'
};

type Entity = 'artist' | 'release' | 'release-group';

type Teardown = () => void;

class RequestError extends Error {

  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}

function getRequest<T>(request: rq.RequestAPI<rq.Request, rq.CoreOptions, rq.RequiredUriUrl>,
                       path: string,
                       options?: rq.CoreOptions): Observable<T> {
  return new Observable<T>(function(this: Observable<T>, subscriber: Subscriber<T>): Teardown {
    const req = request.get(path, options, (err, res, body): void => {
      if (err) {
        subscriber.error(err);
      } else if (res.statusCode !== 200) {
        subscriber.error(new RequestError(res.statusCode, JSON.stringify(res.body)));
      } else {
        subscriber.next(body);
        subscriber.complete();
      }
    });

    return () => {
      req.abort();
    };
  });
}

interface RequestParams {
  [key: string]: string;
}

export class MBApi {

  constructor() {
    this.request = rq.defaults({
      baseUrl: config.endpoint,
      timeout: 20 * 1000,
      headers: {
        'User-Agent': `${config.appName}/${config.appVersion} ( ${config.appMail} )`
      },
      json: true
    });
    this.coverArt = rq.defaults({
      baseUrl: 'https://coverartarchive.org',
      timeout: 20 * 1000,
      headers: {
        'User-Agent': `${config.appName}/${config.appVersion} ( ${config.appMail} )`
      },
      json: true
    });
  }

  private request: rq.RequestAPI<rq.Request, rq.CoreOptions, rq.RequiredUriUrl>;
  private coverArt: rq.RequestAPI<rq.Request, rq.CoreOptions, rq.RequiredUriUrl>;

  private static makeSearchQueryString(fields: { [key: string]: string }): string {
    return Object.keys(fields).map(key => `${key}:${fields[key]}`).join(' AND ');
  }

  private get<T>(path: string, params: RequestParams): Observable<T> {
    const options: rq.CoreOptions = {
      qs: {
        ...params
      }
    };

    return getRequest<T>(this.request, path, options)
      .pipe(
        retryWhen((errors) => {
          return errors
            .pipe(
              switchMap(err => {
                if (err instanceof RequestError && err.code === 503) {
                  return timer(1000);
                }

                return throwError(err);
              }),
              take(5) // retry max 5 times
            );
        })
      );
  }

  private search<T>(entity: Entity, fields: { [key: string]: string }): Observable<T> {
    return this.get<T>(`/${entity}`, { query: MBApi.makeSearchQueryString(fields) });
  }

  releaseGroupsResponseToResult(response: ReleaseGroupsResponse): ReleaseGroupsResult {
    return {
      releaseGroups: response['release-groups'].map<ReleaseGroup>((g) => {
        return {
          id: g.id,
          title: g.title,
          year: extractYear(g['first-release-date']),
          type: g['primary-type']
        };
      })
        .sort(compareByYear.compare)
    };
  }

  searchArtist(name: string): Observable<ArtistSearchResult> {
    return this.search<ArtistSearchResponse>('artist', { sortname: name })
      .pipe(
        map(response => artistSearchResponseToResult(response))
      );
  }

  getReleaseGroups(artistId: string): Observable<ReleaseGroupsResult> {
    return this.get<ReleaseGroupsResponse>('/release-group', { artist: artistId })
      .pipe(
        map(response => this.releaseGroupsResponseToResult(response))
      );
  }

  getCoverArt(type: 'release' | 'release-group', id: string): Observable<string> {
    function extractImage(data: CoverArtResponse): string {
      if (data && Array.isArray(data.images) && data.images.length > 0) {
        return data.images[0].image;
      }
      throw Error(`Cannot extract cover art from response for ${type} ${id}`);
    }

    return getRequest<CoverArtResponse>(this.coverArt, `/${type}/${id}`).pipe(
      map(extractImage)
    );
  }
}

const api = new MBApi();

function processRequestObservable<T>(req: Request, res: Response, data: Observable<T>): void {
  const subscription = data
    .subscribe(
      (result) => res.status(200).json(result),
      (err) => {
        if (err instanceof RequestError) {
          console.error('Request error. Code = ', err.code, '\n', err);
          res.status(err.code).json(err.message);
        } else {
          console.error(err);
          res.status(500).json(err);
        }
      }
    );

  req.on('close', () => subscription.unsubscribe());
}

route.get('/search/artist', async (req, res) => {
  processRequestObservable(req, res, api.searchArtist(req.query.name));
});

route.get('/mb/release-group', async (req, res) => {
  processRequestObservable(req, res, api.getReleaseGroups(req.query.artistId));
});

route.get('/mb/coverart/release-group', async (req, res) => {
  processRequestObservable(req, res, api.getCoverArt('release-group', req.query.id));
});
