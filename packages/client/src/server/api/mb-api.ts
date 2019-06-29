import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Artist {
  id: string;
  name: string;
}

export interface ArtistSearchResult {
  artists: Artist[];
}

@Injectable()
export class MBApi {

  constructor(private http: HttpClient) {
  }

  searchArtist(name: string): Observable<ArtistSearchResult> {
    const url = `${environment.server.url}/search/artist`;
    const params = new HttpParams()
      .set('name', name);
    return this.http.get<ArtistSearchResult>(url, { params });
  }
}