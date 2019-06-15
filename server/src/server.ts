import express = require('express');
import cors = require('cors');
import dotenv = require('dotenv');
import path = require('path');
import bodyParser = require('body-parser');
import { route as uploadRoute } from './routes/upload';
import { route as mb } from './routes/mb';

console.log('Loading env file:', path.resolve(process.cwd(), '.env'));
dotenv.config();

// Create a new express application instance
const app: express.Application = express();
app.use(express.json({ limit: 10240 })); // for parsing application/json
app.use(bodyParser.raw({ type: "image/*", limit: 10 * 1024 * 1024 }))
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(uploadRoute);
app.use(mb);
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(3000, () => {
  console.log('Listening on port 3000.');
});