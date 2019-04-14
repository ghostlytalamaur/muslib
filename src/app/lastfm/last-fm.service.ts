import {Inject, Injectable} from '@angular/core';
import {LAST_FM_CONFIG, LastFmConfig} from './last-fm-config';
import {HttpClient} from '@angular/common/http';
import {UserApi} from './user-api';


@Injectable()
export class LastFmService {

  private mUser: UserApi;

  constructor(
    private http: HttpClient,
    @Inject(LAST_FM_CONFIG) private config: LastFmConfig
  ) {}


  get user(): UserApi {
    if (!this.mUser) {
      console.log('[LastFmService] create UserApi');

      this.mUser = new UserApi(this.http, this.config);
    }
    return this.mUser;
  }

}
