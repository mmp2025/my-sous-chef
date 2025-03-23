import * as express from 'express';
import * as cors from 'cors';
import { YouTubeController } from './controllers/youtubeController';
import { Request, Response } from 'express';

const app = express.default();
const port = process.env.PORT || 5000;

app.use(cors.default());
app.use(express.json());

app.get('/api/youtube/details', async (req: Request, res: Response) => {
  await YouTubeController.getVideoDetails(req, res);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});