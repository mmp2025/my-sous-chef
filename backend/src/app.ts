import express from 'express';
import cors from 'cors';
import { YouTubeController } from './controllers/youtubeController';
import { TranscriptionController } from './controllers/transcriptionController';
import { AudioService } from './services/audioService';
import { Request, Response } from 'express';
import apiRouter from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize audio service
AudioService.initialize().catch(console.error);

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRouter);

// YouTube routes
app.get('/api/youtube/details', async (req: Request, res: Response) => {
  await YouTubeController.getVideoDetails(req, res);
});

// Transcription routes
app.post('/api/transcription/start', async (req: Request, res: Response) => {
  await TranscriptionController.startTranscription(req, res);
});

app.get('/api/transcription/:transcriptId', async (req: Request, res: Response) => {
  await TranscriptionController.getTranscriptionStatus(req, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});