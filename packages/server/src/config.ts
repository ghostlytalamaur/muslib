import * as path from 'path';
import * as fs from 'fs';
import * as t from 'io-ts';
import { either } from 'fp-ts';
import { sharedEnvironment } from '@muslib/shared';
import { failure } from 'io-ts/lib/PathReporter';

export interface Config {
  readonly server: {
    readonly host: string;
    readonly port: number;
  };
  readonly allowedOrigin: readonly RegExp[];
}

const defaultConfig: Config = {
  server: {
    host: sharedEnvironment.server.host,
    port: sharedEnvironment.server.port
  },
  allowedOrigin: []
};

export let config: Config = defaultConfig;

const configType = t.type({
  server: t.type({
    host: t.string,
    port: t.number
  }),
  allowedOrigin: t.array(t.string)
});

export function readConfig(configFile: string): void {
  configFile = path.resolve(__dirname, configFile);
  console.log(`Reading config from ${configFile}`);
  if (!fs.existsSync(configFile)) {
    console.log(`Config file not exists`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(configFile).toString());
  const res = configType.decode(data);

  if (either.isRight(res)) {
    config = {
      server: {
        host: res.right.server.host,
        port: res.right.server.port
      },
      allowedOrigin: res.right.allowedOrigin.map(s => new RegExp(s))
    };
  } else {
    console.log('Config file contains errors. Fallback to default.');
    console.log(failure(res.left));
  }
}
