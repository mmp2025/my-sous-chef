import OpenAI from 'openai';
import { config } from '../config/config';
import rateLimit from 'express-rate-limit';

export interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
  notes?: string;  // For additional context like "finely chopped"
}

export class OpenAIService {
  private static readonly openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  private static requestCount = 0;
  private static lastRequestTime = Date.now();
  private static readonly REQUEST_LIMIT = 20;  // Requests per minute
  private static readonly REQUEST_WINDOW = 60000;  // 1 minute in milliseconds

  private static async checkRateLimit() {
    const now = Date.now();
    if (now - this.lastRequestTime >= this.REQUEST_WINDOW) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    if (this.requestCount >= this.REQUEST_LIMIT) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    this.requestCount++;
  }

  private static cleanJsonString(str: string): string {
    // Remove markdown formatting if present
    str = str.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    // Remove any leading/trailing whitespace
    str = str.trim();
    return str;
  }

  static async extractIngredients(transcript: string): Promise<Ingredient[]> {
    try {
      await this.checkRateLimit();

      const prompt = `
        Extract ingredients from this recipe transcript.
        Return ONLY a JSON array with no additional text or formatting.
        Each ingredient should have these fields:
        - name (required, string)
        - quantity (optional, string)
        - unit (optional, string)
        - notes (optional, string for preparation notes)

        Example response (exact format):
        [{"name":"flour","quantity":"2","unit":"cups","notes":"all-purpose"},{"name":"sugar","quantity":"1","unit":"cup"}]

        Rules:
        1. Return ONLY the JSON array, no other text
        2. Standardize measurements (e.g., "one" → "1")
        3. Combine duplicate ingredients
        4. Exclude cooking equipment
        5. Keep ingredient names simple and standardized

        Transcript:
        ${transcript}
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a precise ingredient parser. Respond only with valid JSON arrays containing ingredients."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1, // Lower temperature for more consistent output
        max_tokens: 1000,
        presence_penalty: 0,
        frequency_penalty: 0,
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from OpenAI');
      }

      // Clean and parse the response
      const cleanedResult = this.cleanJsonString(result);
      console.log('Cleaned OpenAI response:', cleanedResult);

      try {
        const ingredients = JSON.parse(cleanedResult);
        if (!Array.isArray(ingredients)) {
          throw new Error('Response is not an array');
        }
        return ingredients;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Failed to parse ingredients from response');
      }

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          throw error;  // Preserve rate limit errors
        }
        if (error.message.includes('insufficient_quota')) {
          throw new Error('OpenAI API quota exceeded');
        }
        console.error('OpenAI Error:', error);
        throw new Error('Failed to extract ingredients');
      }
      throw error;
    }
  }
} 