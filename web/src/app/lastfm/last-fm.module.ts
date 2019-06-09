import {NgModule} from '@angular/core';
import {LastFmService} from './last-fm.service';
import {LAST_FM_CONFIG, LastFmConfig} from './last-fm-config';
import {HttpClientModule} from '@angular/common/http';

const defLastFmConfig: LastFmConfig = {
  baseUrl: 'http://ws.audioscrobbler.com/2.0/',
  apiKey: 'db9940dd364b69c38784741bcdbe176a'
};

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    LastFmService,
    {provide: LAST_FM_CONFIG, useValue: defLastFmConfig}
  ]
})
export class LastFmModule {
}
