"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
// import firestore = require('@google-cloud/firestore');
const fireStorage = require("@google-cloud/storage");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const request = require("request");
const sharp = require("sharp");
const bodyParser = require("body-parser");
console.log('Loading env file:', path.resolve(process.cwd(), '.env'));
dotenv.config();
const fireApp = admin.initializeApp({
    storageBucket: 'muslib-8ec5b.appspot.com'
});
function dumpStorage(storage) {
    function dumpBucket(bucket) {
        return bucket.getFiles()
            .then(files => {
            const fileNames = files[0].map(f => f.name);
            return { bucket: bucket.name, files: fileNames };
        });
    }
    ;
    function dumpBuckets(buckets) {
        return buckets.map(bucket => {
            return dumpBucket(bucket);
        });
    }
    return storage.getBuckets()
        .then(bucketsRes => {
        return Promise.all(dumpBuckets(bucketsRes[0]));
    })
        .then((bucketDumps) => {
        return { buckets: bucketDumps };
    });
}
function requestBuffer(url) {
    return new Promise((resolve, reject) => {
        request(url, { encoding: null }, (error, res, body) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(body);
            }
        });
    });
}
function resizeImage(image, size) {
    return __awaiter(this, void 0, void 0, function* () {
        return sharp(image)
            .resize(size, size, { fit: "inside" })
            .png()
            .toBuffer();
    });
}
function uploadImage(path, image) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Uploading image. Path:', path);
        yield fireApp.storage().bucket().file(path).save(image);
        console.log('Uploading completed. Path:', path);
        return image;
    });
}
// https://lastfm-img2.akamaized.net/i/u/ar0/d2fbaffb73bf1a0250ec0517f1587963
const storage = new fireStorage.Storage();
// Create a new express application instance
const app = express();
app.use(express.json({ limit: 10240 })); // for parsing application/json
app.use(bodyParser.raw({ type: "image/*", limit: 10 * 1024 * 1024 }));
app.use(cors({ origin: 'http://localhost:4200' }));
app.get('/ping', (req, res) => {
    res.send('pong');
});
app.get('/dump_storage', (req, res) => {
    console.log('/dump_storage request', req);
    dumpStorage(storage)
        .then(dump => { res.send(dump); })
        .catch(err => {
        res.sendStatus(500);
        console.log('Error while dump storage.\n', err);
    });
});
function getImage(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.is('image/*')) {
            if (req.body) {
                return Promise.resolve(req.body);
            }
        }
        else if (req.is('application/json') && req.body && req.body.url) {
            return requestBuffer(req.body.url);
        }
        return Promise.reject(new Error('Unsupported request type'));
    });
}
function saveBuffer(image, filePath) {
    fs.createWriteStream(filePath).write(image);
    return Promise.resolve(image);
}
function getIdToken(req) {
    if (!req.headers.authorization) {
        throw Error('Authorization header missing');
    }
    const parts = req.headers.authorization.split(' ');
    if (parts.length != 2) {
        throw Error('Invalid authorization header');
    }
    return parts[1];
}
function getUserId(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const useAuth = true;
        if (useAuth) {
            const decoded = yield fireApp.auth().verifyIdToken(getIdToken(req));
            return decoded.uid;
        }
        else {
            return Promise.resolve('debug_user_id');
        }
    });
}
function buildImagePath(userId, artistId, suffix) {
    return `users/${userId}/artists/${artistId}/${artistId}_${suffix}`;
}
app.post('/images/artists/:artistId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    console.log('Request parameters:', req.params);
    try {
        const userId = yield getUserId(req);
        const artistId = req.params.artistId;
        const image = yield getImage(req);
        const promises = [];
        promises.push(uploadImage(buildImagePath(userId, req.params.artistId, 'main'), image));
        const resized = yield resizeImage(image, 300);
        promises.push(uploadImage(buildImagePath(userId, artistId, '300'), resized));
        yield Promise.all(promises);
        res.sendStatus(200);
    }
    catch (e) {
        console.log('Error while uploading image\n', e);
        res.sendStatus(500);
    }
}));
app.listen(3000, () => {
    console.log('Listening on port 3000.');
});
//# sourceMappingURL=server.js.map