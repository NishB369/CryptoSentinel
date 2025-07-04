import dotenv from 'dotenv';
dotenv.config();

import './server.js';
import rest from './utils/rest.js';
import { operation } from './config.js';
import sleep from './utils/sleep.js';
import filelog from './utils/filelog.js';

process.on('uncaughtException', (e) => {
  console.error(e);
});

async function run() {
  const { wakeUpTimeMs, workTimeMs, workWaitMs } = operation;

  const restTime = rest(wakeUpTimeMs, workTimeMs);
  if (restTime > 0) {
    filelog('BOT_APP_SLEEP');
    await sleep(restTime);
    filelog('BOT_APP_AWAKE');
  }

  filelog('BOT_APP_RESTING');
  await sleep(workWaitMs);
  filelog('BOT_APP_WORKING');
  await sleep(5000);

  run();
}

filelog('BOT_APP_RUN');
run();
