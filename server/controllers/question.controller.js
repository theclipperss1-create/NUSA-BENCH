import { db } from '../database/db.js';

export const getRandomQuestions = async (req, res, next) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const selected = await db.getRandomQuestions(category, Number(limit));

    res.status(200).json({ data: selected });
  } catch (error) { next(error); }
};

export const verifyAnswer = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    if (!questionId || !answer) return res.status(400).json({ error: 'questionId and answer are required' });

    const data = await db.getQuestion(questionId);
    if (!data) return res.status(404).json({ error: 'Question not found' });

    res.status(200).json({ 
      isCorrect: data.correct_answer === answer, 
      correctAnswer: data.correct_answer,
      explanation: data.explanation 
    });
  } catch (error) { next(error); }
};
