const prisma = require('../lib/prisma');
const groq = require('../lib/openai');
const config = require('../config');
const { getEmbedding } = require('./embeddingService');

async function askQuestion(noteId, question, userId) {
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }
  if (note.status !== 'READY') {
    const err = new Error('Note is still being processed');
    err.status = 400;
    throw err;
  }

  const qEmbedding = await getEmbedding(question);
  const vec = `[${qEmbedding.join(',')}]`;

  const relevantChunks = await prisma.$queryRawUnsafe(
    `SELECT id, content, "chunkIndex",
            1 - (embedding <=> $1::vector) as similarity
     FROM "NoteChunk"
     WHERE "noteId" = $2 AND embedding IS NOT NULL
     ORDER BY embedding <=> $1::vector
     LIMIT $3`,
    vec,
    noteId,
    config.topK
  );

  if (relevantChunks.length === 0) {
    return {
      answer: 'No relevant content found in this note to answer your question.',
      sources: [],
    };
  }

  const context = relevantChunks
    .map((c, i) => `[Source ${i + 1}]: ${c.content}`)
    .join('\n\n');

  const completion = await groq.chat.completions.create({
    model: config.groqModel,
    messages: [
      {
        role: 'system',
        content: `You are a helpful study assistant. Answer the user's question ONLY based on the provided context from their uploaded notes. If the answer cannot be found in the context, clearly state: "This information was not found in your uploaded notes." Be concise, accurate, and mention which source numbers you referenced.`,
      },
      {
        role: 'user',
        content: `Context from notes:\n${context}\n\nQuestion: ${question}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  });

  const answer = completion.choices[0].message.content;

  const sources = relevantChunks.map((c) => ({
    id: c.id,
    content: c.content,
    chunkIndex: c.chunkIndex,
    similarity: parseFloat(Number(c.similarity).toFixed(4)),
  }));

  await prisma.chatMessage.createMany({
    data: [
      { role: 'user', content: question, noteId },
      { role: 'assistant', content: answer, sources, noteId },
    ],
  });

  return { answer, sources };
}

async function getChatHistory(noteId, userId) {
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }
  return prisma.chatMessage.findMany({
    where: { noteId },
    orderBy: { createdAt: 'asc' },
  });
}

module.exports = { askQuestion, getChatHistory };
