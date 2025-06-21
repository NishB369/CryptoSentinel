import { parentPort } from 'worker_threads';
import rest from '../utils/rest.js';
import { operation } from '../config.js';
import sleep from '../utils/sleep.js';
import filelog from '../utils/filelog.js';
import { fetchCryptoNews } from '../apis/cryptoNews.js';

async function run() {
  const { wakeUpTimeMs, workTimeMs, workWaitMs } = operation;

  const restTime = rest(wakeUpTimeMs, workTimeMs);
  if (restTime > 0) {
    filelog('BOT_CRYPTO_NEWS_SLEEP');
    await sleep(restTime);
    filelog('BOT_CRYPTO_NEWS_AWAKE');
  }

  filelog('BOT_CRYPTO_NEWS_RESTING');
  await sleep(workWaitMs);
  filelog('BOT_CRYPTO_NEWS_WORKING');

  const newsItems = await fetchCryptoNews();
  if (newsItems.length > 0) {
    parentPort.postMessage({
      type: 'cryptoNews',
      payload: newsItems,
    });

    console.log('Top 3 Crypto News:');
    newsItems.slice(0, 3).forEach((item, idx) => {
      console.log(`\n${idx + 1}. ${item.title}\n${item.link}\n${item.published}`);
    });
  }

  await sleep(60000);
  run();
}

filelog('BOT_CRYPTO_NEWS_RUN');
run();
