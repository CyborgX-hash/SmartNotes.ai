const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

async function parseFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') {
    return await fs.readFile(filePath, 'utf-8');
  }

  if (ext === '.pdf') {
    const pdfParse = require('pdf-parse');
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  throw new Error('Unsupported file type');
}

function chunkText(text, chunkSize = config.chunkSize, overlap = config.chunkOverlap) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ');
  const chunks = [];

  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 10) {
      chunks.push(chunk);
    }
    i += chunkSize - overlap;
  }

  return chunks;
}

module.exports = { parseFile, chunkText };
