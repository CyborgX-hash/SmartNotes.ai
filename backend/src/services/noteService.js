const fs = require('fs').promises;
const prisma = require('../lib/prisma');
const { parseFile, chunkText } = require('../lib/fileParser');
const { getEmbeddings } = require('./embeddingService');

async function createNote({ file, userId }) {
  const note = await prisma.note.create({
    data: {
      title: file.originalname.replace(/\.[^/.]+$/, ''),
      fileName: file.originalname,
      fileType: file.originalname.endsWith('.pdf') ? 'pdf' : 'txt',
      fileSize: file.size,
      userId,
      status: 'PROCESSING',
    },
  });

  processNote(note.id, file.path).catch(async (err) => {
    console.error(`[Note] Failed to process ${note.id}:`, err.message);
    await prisma.note.update({
      where: { id: note.id },
      data: { status: 'FAILED' },
    }).catch(console.error);
  });

  return note;
}

async function processNote(noteId, filePath) {
  try {
    const text = await parseFile(filePath);
    if (!text || text.trim().length < 20) {
      throw new Error('Insufficient text content extracted from file');
    }

    const chunks = chunkText(text);
    console.log(`[Note] Processing ${noteId}: ${chunks.length} chunks`);

    const embeddings = await getEmbeddings(chunks);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = await prisma.noteChunk.create({
        data: { content: chunks[i], chunkIndex: i, noteId },
      });

      const vec = `[${embeddings[i].join(',')}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE "NoteChunk" SET embedding = $1::vector WHERE id = $2`,
        vec,
        chunk.id
      );
    }

    await prisma.note.update({
      where: { id: noteId },
      data: { status: 'READY' },
    });

    console.log(`[Note] ${noteId} ready with ${chunks.length} chunks`);
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
}

async function getUserNotes(userId) {
  return prisma.note.findMany({
    where: { userId },
    include: { _count: { select: { chunks: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function getNote(noteId, userId) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: {
      _count: { select: { chunks: true, chatMessages: true, quizzes: true } },
    },
  });
  if (!note) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }
  return note;
}

async function deleteNote(noteId, userId) {
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }
  await prisma.note.delete({ where: { id: noteId } });
}

module.exports = { createNote, getUserNotes, getNote, deleteNote };
