import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { route as uploadRoute } from './routes/upload';
import { route as mb } from './routes/mb';
import { sharedEnvironment } from '@muslib/shared';
import { config, readConfig } from './config';

console.log('Loading env file:', path.resolve(process.cwd(), '.env'));
dotenv.config();
readConfig('server.config.json');

// Create a new express application instance
const app: express.Application = express();
app.use(express.json({ limit: 10240 })); // for parsing application/json
app.use(bodyParser.raw({ type: 'image/*', limit: 10 * 1024 * 1024 }));
app.use(cors({ origin: config.allowedOrigin.slice() }));
app.use(uploadRoute);
app.use(mb);
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(sharedEnvironment.server.port, sharedEnvironment.server.host, () => {
  console.log(`Listening on http://${config.server.host}:${config.server.port}.`);
});
