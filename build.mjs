#!/usr/bin/env node
// Build content.json from the vault's scraps folder.
// Reads: <VAULT>/03_Resources/Scraps/{quotes,images}/
// Writes: ./content.json + ./images/<file> for image scraps
// Only items with `status: approved` get published.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = __dirname;
const VAULT = process.env.SCRAPS_VAULT ||
  '/Users/alexmorris/Documents/claudesidian/03_Resources/Scraps';

const QUOTES_DIR = path.join(VAULT, 'quotes');
const IMAGES_DIR = path.join(VAULT, 'images');
const REPO_IMAGES = path.join(REPO, 'images');
const CONTENT_JSON = path.join(REPO, 'content.json');

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      try { v = JSON.parse(v.replace(/^'|'$/g, '"')); } catch { v = v.slice(1, -1); }
    }
    fm[kv[1]] = v;
  }
  return { fm, body: m[2].trim() };
}

function readQuotes() {
  if (!fs.existsSync(QUOTES_DIR)) return [];
  const out = [];
  let skipped = 0;
  for (const f of fs.readdirSync(QUOTES_DIR).sort()) {
    if (!f.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(QUOTES_DIR, f), 'utf8');
    const { fm, body } = parseFrontmatter(raw);
    if (fm.status !== 'approved') { skipped++; continue; }
    if (!body) continue;
    const item = { type: 'quote', text: body, author: fm.author || '' };
    out.push(item);
  }
  console.log(`  quotes: ${out.length} approved (skipped ${skipped} review/draft)`);
  return out;
}

function readImages() {
  if (!fs.existsSync(IMAGES_DIR)) return [];
  const out = [];
  let skipped = 0;
  fs.mkdirSync(REPO_IMAGES, { recursive: true });
  for (const f of fs.readdirSync(IMAGES_DIR).sort()) {
    if (!f.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(IMAGES_DIR, f), 'utf8');
    const { fm } = parseFrontmatter(raw);
    if (fm.status !== 'approved') { skipped++; continue; }
    if (!fm.image) continue;
    const srcImg = path.join(IMAGES_DIR, fm.image);
    if (!fs.existsSync(srcImg)) {
      console.warn(`  WARN: ${f} references missing image ${fm.image}`);
      continue;
    }
    const dstImg = path.join(REPO_IMAGES, fm.image);
    fs.copyFileSync(srcImg, dstImg);
    const item = { type: 'image', src: `./images/${fm.image}`, caption: fm.caption || '' };
    out.push(item);
  }
  console.log(`  images: ${out.length} approved (skipped ${skipped} review/draft)`);
  return out;
}

function writeContentJson(items) {
  const lines = ['{', '  "items": ['];
  items.forEach((item, i) => {
    const parts = [];
    if (item.type) parts.push(`"type": ${JSON.stringify(item.type)}`);
    if (item.text != null) parts.push(`"text": ${JSON.stringify(item.text)}`);
    if (item.src != null) parts.push(`"src": ${JSON.stringify(item.src)}`);
    if (item.caption != null) parts.push(`"caption": ${JSON.stringify(item.caption)}`);
    if (item.author != null) parts.push(`"author": ${JSON.stringify(item.author)}`);
    const comma = i < items.length - 1 ? ',' : '';
    lines.push(`    { ${parts.join(', ')} }${comma}`);
  });
  lines.push('  ]', '}', '');
  fs.writeFileSync(CONTENT_JSON, lines.join('\n'));
}

console.log(`Building content.json from: ${VAULT}`);
const quotes = readQuotes();
const images = readImages();
const items = [...quotes, ...images];
writeContentJson(items);
console.log(`Wrote ${items.length} items to ${path.relative(REPO, CONTENT_JSON)}`);
