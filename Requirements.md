Below is a concise Product Requirements Document (PRD) for **SousChefAI**, followed by a breakdown of small, actionable milestones for development using Cursor. The PRD outlines the core features, assumptions, and requirements, while the milestones provide a step-by-step plan to build the web app iteratively.

---

### Product Requirements Document (PRD) for SousChefAI

#### Product Overview
**Product Name:** SousChefAI  
**Vision:** Empower home cooks by extracting, translating, and organizing recipe details from YouTube videos, with AI-powered Q&A and seamless sharing capabilities.  
**Objective:** Create a lightweight, intuitive web app that processes YouTube recipe videos, provides ingredient lists, answers user questions, and enables sharing via WhatsApp, all while allowing recipe saving for future use.

#### Target Audience
- Home cooks who watch recipe videos on YouTube.
- Users comfortable with English but open to recipes in other languages.
- Tech-savvy individuals who value convenience and AI assistance.

#### Key Features
1. **YouTube Link Input**
   - Users paste a YouTube video URL into a text field.
   - Basic validation ensures it’s a valid YouTube link.
2. **Transcription & Translation**
   - Extracts transcript using AssemblyAI.
   - Translates non-English transcripts to English using AssemblyAI.
   - Displays transcript and translation behind a clickable “View Details” button (non-prominent UI).
3. **Ingredient Extraction**
   - Parses transcript to identify and list ingredients.
   - Displays ingredients in a clean, selectable checklist format.
4. **Video Thumbnail**
   - Shows the YouTube video thumbnail alongside the recipe name for visual context.
5. **AI-Powered Q&A**
   - Users can input questions about the video content (e.g., “What’s the cooking time?”).
   - OpenAI API processes the transcript and provides answers.
6. **Recipe Saving**
   - Users can save the recipe name and ingredient list locally (e.g., browser storage).
   - Saved recipes are accessible on a “Saved Recipes” page.
7. **WhatsApp Sharing**
   - Users select ingredients from the list.
   - Generates a shareable text (e.g., “SousChefAI Recipe: [Recipe Name] - Ingredients: [Selected Items]”) with a WhatsApp button.
8. **UI/UX Guidelines**
   - Simple, clean design with focus on ingredient list and Q&A.
   - Thumbnail and recipe name prominently displayed.
   - Transcript/translation hidden behind a button for minimal distraction.

#### Assumptions
- Users have stable internet access for API calls.
- YouTube videos have transcripts or audio suitable for AssemblyAI processing.
- OpenAI API can handle Q&A based on transcript context.
- Free APIs (e.g., YouTube Data API) are sufficient for thumbnail extraction.

#### Non-Functional Requirements
- **Performance:** Process video in <180 econds (excluding API latency).
- **Scalability:** Handle up to 100 concurrent users initially.
- **Security:** No user data stored beyond local browser storage.

#### Tech Stack (Agnostic with Preferences)
- **Frontend:** Any framework (e.g., React, Vue) for UI.
- **Backend:** Any server-side tech (e.g., Node.js, Flask) for API integration.
- **APIs:**
  - AssemblyAI: Transcription and translation.
  - OpenAI API: Q&A functionality.
  - YouTube Data API (free): Thumbnail and metadata.
  - WhatsApp API (free): Sharing via pre-filled link.
- **Storage:** Local browser storage (e.g., LocalStorage) for saved recipes.
- **Dev Tool:** Cursor for vibe-coding.

#### Success Metrics
- 80% of processed videos correctly extract ingredients.
- 90% user satisfaction with Q&A responses.
- 50 saved recipes within first month of launch.

---

### Development Milestones for SousChefAI

Here’s a breakdown of small, executable milestones to build SousChefAI iteratively using Cursor. Each milestone is scoped to be achievable in a single coding session (1-3 hours), avoiding a big-bang approach.

#### Milestone 1: Basic UI Skeleton
- **Goal:** Set up a simple web app with input field and static layout.
- **Tasks:**
  - Create a project with a frontend framework (e.g., React via `create-react-app`).
  - Add a text input for YouTube URL and a “Process” button.
  - Display placeholder sections for thumbnail, recipe name, ingredients, and Q&A.
  - Style minimally with CSS (e.g., flexbox for layout).
- **Cursor Prompt:** “Create a React app with a text input for a YouTube URL, a button, and placeholder divs for thumbnail, recipe name, ingredients, and Q&A. Use basic CSS for layout.”

#### Milestone 2: YouTube URL Validation & Thumbnail
- **Goal:** Validate input and fetch video thumbnail.
- **Tasks:**
  - Add logic to validate YouTube URL (regex or library like `youtube-url`).
  - Integrate YouTube Data API to fetch video thumbnail and title.
  - Display thumbnail and title above the ingredient section.
- **Cursor Prompt:** “Add YouTube URL validation to my React app and fetch the video thumbnail and title using the YouTube Data API. Display them in the UI.”

#### Milestone 3: Transcription with AssemblyAI
- **Goal:** Extract and display transcript from the video.
- **Tasks:**
  - Set up a backend (e.g., Node.js with Express) to handle API calls.
  - Integrate AssemblyAI API to transcribe the YouTube video (requires URL-to-audio extraction or direct upload).
  - Store transcript in state and display it behind a “View Transcript” button.
- **Cursor Prompt:** “Set up a Node.js backend with Express, integrate AssemblyAI API to transcribe a YouTube video from a URL, and send the transcript to my React frontend. Display it behind a button.”

#### Milestone 5: Ingredient Extraction
- **Goal:** Parse transcript and list ingredients.
- **Tasks:**
  - Write a simple parsing function (e.g., regex or NLP heuristic) to extract ingredients from the transcript.
  - Display ingredients as a selectable checklist in the UI.
  - Handle edge cases (e.g., no ingredients found).
- **Cursor Prompt:** “Create a function to extract ingredients from a transcript string using regex or basic NLP, and display them as a checkbox list in my React app.”

#### Milestone 6: AI-Powered Q&A
- **Goal:** Enable users to ask questions about the video.
- **Tasks:**
  - Add a text input and “Ask” button below the ingredients.
  - Integrate OpenAI API in the backend to process questions using the transcript as context.
  - Display AI responses below the input.
- **Cursor Prompt:** “Add a Q&A section to my React app with a text input and button. Update the backend to use OpenAI API to answer questions based on the transcript, and show responses in the UI.”

#### Milestone 7: Recipe Saving
- **Goal:** Save recipe name and ingredients locally.
- **Tasks:**
  - Add a “Save Recipe” button near the recipe name.
  - Use LocalStorage to save recipe name and ingredient list.
  - Create a “Saved Recipes” page to list saved recipes.
- **Cursor Prompt:** “Add a ‘Save Recipe’ button to my React app that saves the recipe name and ingredients to LocalStorage. Create a new page to display saved recipes.”

#### Milestone 8: WhatsApp Sharing
- **Goal:** Share selected ingredients via WhatsApp.
- **Tasks:**
  - Add a “Share on WhatsApp” button below the ingredient list.
  - Generate a text string with recipe name and selected ingredients.
  - Use WhatsApp API (e.g., `https://wa.me/?text=`) to open WhatsApp with pre-filled text.
- **Cursor Prompt:** “Add a ‘Share on WhatsApp’ button to my React app that generates a text string with the recipe name and selected ingredients, and opens WhatsApp with the text using the WhatsApp API.”

#### Milestone 9: Polish & Testing
- **Goal:** Refine UI/UX and test end-to-end.
- **Tasks:**
  - Improve CSS for a clean, intuitive look (e.g., spacing, fonts).
  - Test all features with sample YouTube recipe videos (English and non-English).
  - Fix bugs (e.g., API errors, UI glitches).
- **Cursor Prompt:** “Help me polish the CSS in my React app for a clean design, and guide me through testing the app with sample YouTube URLs.”

#### Milestone 10: Deployment
- **Goal:** Deploy the app for personal use or sharing.
- **Tasks:**
  - Deploy frontend (e.g., Netlify) and backend (e.g., Heroku).
  - Set up environment variables for API keys (AssemblyAI, OpenAI, YouTube).
  - Verify functionality post-deployment.
- **Cursor Prompt:** “Guide me to deploy my React frontend to Netlify and Node.js backend to Heroku, including setting up API keys as environment variables.”

---

### Next Steps
Start with **Milestone 1** and use Cursor to execute each step. After each milestone, test the app manually to ensure it works as expected before moving to the next one. Keep the code modular to avoid and easily debug errors. This iterative approach keeps the project manageable and allows you to vibe-code with Cursor effectively. Let me know if you’d like help refining any milestone or crafting specific Cursor prompts!