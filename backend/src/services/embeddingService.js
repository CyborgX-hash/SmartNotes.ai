let extractor = null;

async function getExtractor() {
  if (!extractor) {
    const { pipeline, env } = await import('@xenova/transformers');
    env.cacheDir = './.cache';
    env.allowLocalModels = true;
    console.log('[Embeddings] Loading model (first run downloads ~30MB)...');
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('[Embeddings] Model loaded successfully');
  }
  return extractor;
}

async function getEmbedding(text) {
  const ext = await getExtractor();
  const output = await ext(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

async function getEmbeddings(texts) {
  const results = [];
  for (const text of texts) {
    results.push(await getEmbedding(text));
  }
  return results;
}

module.exports = { getEmbedding, getEmbeddings };
