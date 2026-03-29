const prisma = require('../lib/prisma');
const groq = require('../lib/openai');
const config = require('../config');

async function generateQuiz(noteId, userId, { difficulty, numQuestions }) {
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

  const chunks = await prisma.noteChunk.findMany({
    where: { noteId },
    select: { content: true },
  });

  const sampled = chunks
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(5, chunks.length));

  const context = sampled.map((c) => c.content).join('\n\n');

  // Use a fast model for quiz generation (structured JSON output)
  const quizModel = config.groqQuizModel || 'llama-3.1-8b-instant';

  const completion = await groq.chat.completions.create({
    model: quizModel,
    messages: [
      {
        role: 'system',
        content: `You are an expert quiz creator. Generate exactly ${numQuestions} ${difficulty}-level MCQ questions from the study notes below. Return ONLY a valid JSON array. No markdown, no code blocks, no extra text. Each object: {"question": "...", "answer": "...", "options": ["...", "...", "...", "..."]}. The correct answer must be one of the 4 options. Be concise.`,
      },
      {
        role: 'user',
        content: `Study notes:\n${context}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });

  let questions;
  try {
    const raw = completion.choices[0].message.content.trim();
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    questions = JSON.parse(cleaned);
  } catch {
    const err = new Error('Failed to generate valid questions. Please try again.');
    err.status = 500;
    throw err;
  }

  const quiz = await prisma.quiz.create({
    data: { difficulty, numQuestions, questions, noteId },
  });

  return quiz;
}

async function getQuizHistory(noteId, userId) {
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }
  return prisma.quiz.findMany({
    where: { noteId },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { generateQuiz, getQuizHistory };
