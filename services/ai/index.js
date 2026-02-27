// AI Microservice
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection setup (non-blocking)
let mongoClient = null;
let mongoConnected = false;

const initializeMongoClient = async () => {
  try {
    const { MongoClient } = require('mongodb');
    
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI environment variable is not set');
      return;
    }

    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    mongoConnected = true;
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.warn('⚠ MongoDB connection failed (service will continue without DB):', error.message);
    mongoConnected = false;
  }
};

// Initialize MongoDB connection asynchronously
initializeMongoClient().catch(console.error);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'AI Service is running',
    mongodb_connected: mongoConnected,
    timestamp: new Date().toISOString()
  });
});

// Generate Aptitude Questions
app.post('/api/ai/generate-aptitude', async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ error: 'Topic and difficulty are required' });
    }

    if (!mongoConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Your AI generation logic here
    const questions = await generateAptitudeQuestions(topic, difficulty, count);
    
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('Error generating aptitude questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Generate Coding Problems
app.post('/api/ai/generate-coding', async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ error: 'Topic and difficulty are required' });
    }

    if (!mongoConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Your AI generation logic here
    const problems = await generateCodingProblems(topic, difficulty, count);
    
    res.json({ success: true, data: problems });
  } catch (error) {
    console.error('Error generating coding problems:', error);
    res.status(500).json({ error: 'Failed to generate problems' });
  }
});

// Helper function - replace with your actual AI logic
async function generateAptitudeQuestions(topic, difficulty, count = 5) {
  try {
    if (!mongoClient) {
      throw new Error('MongoDB client not initialized');
    }

    const db = mongoClient.db('saviai_db');
    
    // Fetch from database or generate using AI model
    const questions = await db.collection('aptitude_questions')
      .find({ topic, difficulty })
      .limit(count)
      .toArray();
    
    return questions;
  } catch (error) {
    console.error('Error in generateAptitudeQuestions:', error);
    throw error;
  }
}

async function generateCodingProblems(topic, difficulty, count = 5) {
  try {
    if (!mongoClient) {
      throw new Error('MongoDB client not initialized');
    }

    const db = mongoClient.db('saviai_db');
    
    // Fetch from database or generate using AI model
    const problems = await db.collection('coding_problems')
      .find({ topic, difficulty })
      .limit(count)
      .toArray();
    
    return problems;
  } catch (error) {
    console.error('Error in generateCodingProblems:', error);
    throw error;
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, gracefully shutting down...');
  if (mongoClient) {
    await mongoClient.close();
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`✓ AI Service listening on port ${PORT}`);
});

