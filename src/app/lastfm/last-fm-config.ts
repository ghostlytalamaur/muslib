import {InjectionToken} from '@angular/core';

export interface LastFmConfig {
  baseUrl: string;
  apiKey: string;
}

export const LAST_FM_CONFIG = new InjectionToken<LastFmConfig>('last.fm config');
