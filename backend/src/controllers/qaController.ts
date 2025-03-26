import { Request, Response } from 'express';
import { OpenAIService } from '../services/openaiService';

export class QAController {
  static async askQuestion(req: Request, res: Response) {
    try {
      const { question, context } = req.body;
      
      console.log('Received question:', { question, contextLength: context?.length }); // Debug log

      if (!question || !context) {
        return res.status(400).json({ error: 'Question and context are required' });
      }

      const answer = await OpenAIService.answerQuestion(question, context);
      
      console.log('Generated answer:', answer); // Debug log
      
      res.json({ answer });
    } catch (error) {
      console.error('QA Error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to get answer',
        details: error instanceof Error ? error.stack : undefined
      });
    }
  }
} 