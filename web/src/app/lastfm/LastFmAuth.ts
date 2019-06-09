import {HttpClient} from '@angular/common/http';
import {Inject} from '@angular/core';
import {LAST_FM_CONFIG, LastFmConfig} from './last-fm-config';


export class LastFmAuth {
  constructor(
    private http: HttpClient,
    @Inject(LAST_FM_CONFIG) private config: LastFmConfig
  ) {
  }

  authorize() {
    const callbackUrl = window.location.origin + '/auth/complete';
    const url = `http://www.last.fm/api/auth/?api_key=${this.config.apiKey}&cb=${callbackUrl}`;
  }
}
