import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ArtistSearchResult, CoverArtResult, ReleaseGroupsResult, sharedEnvironment } from '@muslib/shared';
import { map } from 'rxjs/operators';


@Injectable()
export class MBApi {

  constructor(private http: HttpClient) {
  }

  searchArtist(name: string): Observable<ArtistSearchResult> {
    const url = `${sharedEnvironment.server.url}/mb/search/artist`;
    const params = new HttpParams()
      .set('name', name);
    return this.http.get<ArtistSearchResult>(url, { params });
  }

  releaseGroups(artistId: string): Observable<ReleaseGroupsResult> {
    const url = `${sharedEnvironment.server.url}/mb/release-group`;
    const params = new HttpParams()
      .set('artistId', artistId);
    return this.http.get<ReleaseGroupsResult>(url, { params });
  }

  coverArt(id: string): Observable<string> {
    const url = `${sharedEnvironment.server.url}/mb/coverart/release-group`;
    const params = new HttpParams()
      .set('id', id);
    return this.http.get<CoverArtResult>(url, { params })
      .pipe(
        map(data => data.url)
      );
  }
}
