import { parseStringPromise } from 'xml2js';

const CRYPTO_RSS_URL = 'https://www.coindesk.com/arc/outboundfeeds/rss/';

export async function fetchCryptoNews() {
  try {
    const response = await fetch(CRYPTO_RSS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xml = await response.text();
    const result = await parseStringPromise(xml);

    const items = result.rss.channel[0].item;
    return items.map((item) => ({
      title: item.title[0],
      link: item.link[0],
      published: item.pubDate[0],
      description: item.description?.[0] || '',
    }));
  } catch (error) {
    console.error('Error fetching or parsing crypto news RSS feed:', error);
    return [];
  }
}
