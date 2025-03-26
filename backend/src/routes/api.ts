import express from 'express';
import { YouTubeController } from '../controllers/youtubeController';
import { TranscriptionController } from '../controllers/transcriptionController';
import { QAController } from '../controllers/qaController';

const router = express.Router();

// Existing routes
router.get('/youtube/details', YouTubeController.getVideoDetails);
router.post('/transcription/start', TranscriptionController.startTranscription);
router.get('/transcription/:transcriptId', TranscriptionController.getTranscriptionStatus);

// Add QA route
router.post('/qa/ask', QAController.askQuestion);

export default router; 