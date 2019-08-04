// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const sharedEnvironment = {
  server: {
    host: 'localhost',
    port: 8080,
    get url(): string {
      return `http://${this.host}:${this.port}`;
    }
  },
  firebase: {
    apiKey: 'AIzaSyAfk3uOTDs94m4Wql1GkAEaoloWMNpY25w',
    authDomain: 'muslib-8ec5b.firebaseapp.com',
    databaseURL: 'https://muslib-8ec5b.firebaseio.com',
    projectId: 'muslib-8ec5b',
    storageBucket: 'muslib-8ec5b.appspot.com',
    messagingSenderId: '763446980841'
  }
};
