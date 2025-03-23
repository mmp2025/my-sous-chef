# My Sous Chef

A web application that transcribes cooking videos and extracts ingredients.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cd backend
   cp .env.example .env
   ```
4. Start the development servers:
   ```bash
   # Terminal 1
   cd frontend && npm run dev
   
   # Terminal 2
   cd backend && npm run dev
   ```

## Environment Variables

Backend:
- `PORT`: Server port (default: 5000)
- `YOUTUBE_API_KEY`: YouTube Data API key
- `ASSEMBLY_AI_API_KEY`: AssemblyAI API key

## Features

- YouTube video transcription
- Ingredient extraction (coming soon) 