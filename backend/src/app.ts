import * as express from 'express';
import * as cors from 'cors';
import { YouTubeController } from './controllers/youtubeController';
import { TranscriptionController } from './controllers/transcriptionController';
import { AudioService } from './services/audioService';
import { Request, Response } from 'express';

const app = express.default();
const port = process.env.PORT || 5000;

// Initialize audio service
AudioService.initialize().catch(console.error);

app.use(cors.default());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});