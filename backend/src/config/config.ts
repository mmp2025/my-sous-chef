import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: string | number;
  youtubeApiKey: string | undefined;
  assemblyAiApiKey: string | undefined;
  openaiApiKey: string | undefined;
}

export const config: Config = {
  port: process.env.PORT || 5000,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  assemblyAiApiKey: process.env.ASSEMBLY_AI_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY
}; 