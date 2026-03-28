require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  maxFileSize: 10 * 1024 * 1024,
  allowedFileTypes: ['application/pdf', 'text/plain'],
  chunkSize: 300,
  chunkOverlap: 50,
  topK: 5,
};
