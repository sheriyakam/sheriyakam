/**
 * scripts/ping-indexnow.mjs
 * Post-Deploy Automated IndexNow Batch Submission Script.
 * 
 * Reads all canonical URLs from public/sitemap.xml and transmits a batch
 * indexing payload to the IndexNow gateway for instant Bing, Yandex, and Naver discovery.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'sheriyakam.vercel.app';
const KEY = 'c83b92f701a44e598fa20967db55e31a';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

async function runIndexNow() {
  console.log('🚀 [IndexNow] Starting automated search indexing ping...');

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ [IndexNow] public/sitemap.xml not found.');
    process.exit(1);
  }

  const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urlMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  const urlList = urlMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

  if (urlList.length === 0) {
    console.error('❌ [IndexNow] No URLs discovered in sitemap.xml.');
    process.exit(1);
  }

  console.log(`📡 [IndexNow] Discovered ${urlList.length} canonical URLs for submission:`);
  urlList.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList,
  };

  const ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const endpoint of ENDPOINTS) {
    try {
      console.log(`\n📤 Transmitting batch payload to ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'User-Agent': 'Sheriyakam-IndexNow-Bot/1.0'
        },
        body: JSON.stringify(payload)
      });

      console.log(`   Response Status: ${response.status} ${response.statusText}`);
      if (response.status === 200 || response.status === 202) {
        console.log(`   ✅ Successfully submitted ${urlList.length} URLs to IndexNow (${endpoint})!`);
      } else {
        const body = await response.text();
        console.warn(`   ⚠️ IndexNow warning/response body:`, body || 'No body returned');
      }
    } catch (err) {
      console.warn(`   ⚠️ Network note for ${endpoint}:`, err.message);
    }
  }

  console.log('\n🏁 [IndexNow] Ping routine complete.\n');
}

runIndexNow();
