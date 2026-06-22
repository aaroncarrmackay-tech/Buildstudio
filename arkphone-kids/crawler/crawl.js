#!/usr/bin/env node
/**
 * Arkphone Kids — Source Crawler
 *
 * Fetches official emergency-prep pages and sends extracted content to the
 * local AI ("empire") so it can draft structured Arkphone card data.
 *
 * Setup:
 *   cp crawler/config.example.json crawler/config.json
 *   # edit config.json — set empire.endpoint and empire.model
 *   npm run crawl
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────

const configPath = join(__dirname, 'config.json');
let config;
try {
  config = JSON.parse(readFileSync(configPath, 'utf8'));
} catch {
  const example = join(__dirname, 'config.example.json');
  console.error('ERROR: crawler/config.json not found.');
  console.error(`  cp ${example} crawler/config.json`);
  console.error('  Then edit config.json and set empire.endpoint + empire.model.');
  process.exit(1);
}

const { empire, crawl = {}, sources } = config;

if (!empire?.endpoint) {
  console.error('ERROR: config.json is missing empire.endpoint');
  process.exit(1);
}

if (!Array.isArray(sources) || sources.length === 0) {
  console.error('ERROR: config.json sources array is empty');
  process.exit(1);
}

// ── HTML → plain text ─────────────────────────────────────────────────────────

function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ── Fetch a page ──────────────────────────────────────────────────────────────

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), crawl.timeoutMs ?? 15000);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': crawl.userAgent ?? 'ArkphoneKids-Crawler/1.0 (family emergency prep)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-CA,en;q=0.9'
      }
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    return await resp.text();
  } finally {
    clearTimeout(timer);
  }
}

// ── Build prompt for empire ───────────────────────────────────────────────────

function buildPrompt(source, text) {
  const maxChars = crawl.maxContentChars ?? 6000;
  const snippet = text.length > maxChars ? text.slice(0, maxChars) + '\n[... truncated ...]' : text;

  return `You are a content assistant helping update Arkphone Kids, an offline family emergency preparedness app for Canadian families.

I have scraped the following official source:
- Source name: ${source.name}
- Source URL: ${source.url}
- Target card ID: ${source.cardId ?? source.id}

RAW SCRAPED CONTENT:
---
${snippet}
---

Extract the emergency preparedness information and return a single JSON object with exactly these fields. All values are strings except first5 which is an array of exactly 5 strings.

{
  "situation": "one sentence: what emergency scenario this card covers",
  "danger": "key dangers in this scenario described concisely",
  "first5": [
    "immediate action 1",
    "immediate action 2",
    "immediate action 3",
    "immediate action 4",
    "immediate action 5"
  ],
  "family": "simplified plain-language instructions for children and parents",
  "notDo": "what NOT to do — safety-critical things to avoid",
  "supplies": "comma-separated list of supplies needed",
  "callEmergency": "specific situations that require calling 911 or emergency services"
}

Return ONLY the JSON object. No markdown fences, no commentary, no extra text.`;
}

// ── Send payload to empire ────────────────────────────────────────────────────

async function sendToEmpire(prompt) {
  const { endpoint, apiType = 'ollama', model = 'llama3', headers = {} } = empire;

  let body;
  if (apiType === 'ollama') {
    body = JSON.stringify({ model, prompt, stream: false });
  } else if (apiType === 'openai') {
    body = JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }]
    });
  } else {
    // generic webhook — post raw prompt + metadata
    body = JSON.stringify({ prompt, source: 'arkphone-crawler' });
  }

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body
  });

  if (!resp.ok) {
    const snippet = (await resp.text()).slice(0, 300);
    throw new Error(`Empire returned ${resp.status}: ${snippet}`);
  }

  return resp.json();
}

// ── Parse empire response to card JSON ───────────────────────────────────────

function parseEmpireResponse(raw) {
  const { apiType = 'ollama' } = empire;
  let text = '';

  if (apiType === 'ollama') {
    text = raw.response ?? '';
  } else if (apiType === 'openai') {
    text = raw.choices?.[0]?.message?.content ?? '';
  } else {
    text = typeof raw === 'string' ? raw : JSON.stringify(raw);
  }

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { raw: text, parsed: null };

  try {
    return { raw: text, parsed: JSON.parse(match[0]) };
  } catch {
    return { raw: text, parsed: null };
  }
}

// ── Sleep ─────────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const startedAt = new Date().toISOString();
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   Arkphone Kids — Source Crawler     ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`  Started:  ${startedAt}`);
  console.log(`  Empire:   ${empire.endpoint}  (${empire.apiType ?? 'ollama'})`);
  console.log(`  Sources:  ${sources.length}`);
  console.log('');

  const outputDir = join(__dirname, 'output');
  mkdirSync(outputDir, { recursive: true });

  const results = [];

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const label = `[${i + 1}/${sources.length}]`;

    console.log(`${label} ${source.name}`);
    console.log(`      ${source.url}`);

    // 1. Fetch
    let text;
    try {
      const html = await fetchPage(source.url);
      text = extractText(html);
      console.log(`      Fetched — ${text.length.toLocaleString()} chars extracted`);
    } catch (err) {
      console.error(`      FETCH FAILED: ${err.message}`);
      results.push({ id: source.id, status: 'fetch-error', error: err.message });
      await sleep(crawl.delayMs ?? 2000);
      continue;
    }

    // 2. Save raw text regardless of empire outcome
    const rawPath = join(outputDir, `${source.id}.raw.txt`);
    writeFileSync(rawPath, `Source: ${source.name}\nURL: ${source.url}\nFetched: ${new Date().toISOString()}\n\n${text}`, 'utf8');

    // 3. Send to empire
    let parsed = null;
    let empireRaw = '';
    try {
      const prompt = buildPrompt(source, text);
      console.log(`      Sending to empire…`);
      const response = await sendToEmpire(prompt);
      const result = parseEmpireResponse(response);
      empireRaw = result.raw;
      parsed = result.parsed;

      if (parsed) {
        console.log(`      Empire responded — card draft extracted`);
      } else {
        console.warn(`      Empire responded — could not parse JSON from response`);
      }
    } catch (err) {
      console.error(`      EMPIRE FAILED: ${err.message}`);
      results.push({ id: source.id, status: 'empire-error', error: err.message });
      await sleep(crawl.delayMs ?? 2000);
      continue;
    }

    // 4. Save card draft
    const draft = {
      crawledAt: new Date().toISOString(),
      source: { name: source.name, url: source.url },
      cardId: source.cardId ?? source.id,
      cardDraft: parsed,
      empireRaw: parsed ? undefined : empireRaw
    };

    const draftPath = join(outputDir, `${source.id}.draft.json`);
    writeFileSync(draftPath, JSON.stringify(draft, null, 2), 'utf8');
    console.log(`      Saved → crawler/output/${source.id}.draft.json`);

    results.push({ id: source.id, cardId: source.cardId ?? source.id, status: parsed ? 'ok' : 'parse-warn' });

    if (i < sources.length - 1) await sleep(crawl.delayMs ?? 2000);
  }

  // 5. Summary
  const summary = {
    crawledAt: startedAt,
    finishedAt: new Date().toISOString(),
    empire: empire.endpoint,
    counts: {
      total: results.length,
      ok: results.filter(r => r.status === 'ok').length,
      parseWarn: results.filter(r => r.status === 'parse-warn').length,
      errors: results.filter(r => r.status.endsWith('-error')).length
    },
    results
  };

  const summaryPath = join(outputDir, 'crawl-summary.json');
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log('');
  console.log(`Done — ${summary.counts.ok} ok, ${summary.counts.parseWarn} parse-warn, ${summary.counts.errors} errors`);
  console.log(`Summary → crawler/output/crawl-summary.json`);
  console.log('');

  if (summary.counts.errors > 0) process.exit(1);
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
