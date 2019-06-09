"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import admin = require('firestore-admin');
// import firestore = require('@google-cloud/firestore');
const fireStorage = require("@google-cloud/storage");
const settings = {
    projectId: 'muslib-8ec5b',
    keyFilename: '../../src/environments/muslib-707fa22a5e59.json'
};
// const store = new firestore.Firestore(settings);
const storage = new fireStorage.Storage(settings);
storage.getBuckets()
    .then(bucketsRes => {
    const [buckets] = bucketsRes;
    buckets.forEach(bucket => {
        console.log(bucket.name);
    });
})
    .catch(err => {
    console.log('Error while getting buckets.', err);
});
// // Create a new express application instance
// const app: express.Application = express();
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
// app.post('/upload/${url}', (req, res) => {
// })
// app.listen(3000, ()  =>{
//   console.log('Example app listening on port 3000!');
// });
//# sourceMappingURL=server.js.map