import type { NextApiRequest, NextApiResponse } from "next";

export type Quote = {
  content: string;
  author: string;
  tags: string[];
  _id: string;
};

export type QuotesResponse = {
  results: Quote[];
  count: number;
  totalCount: number;
  page: number;
  totalPages: number;
  lastItemIndex: number;
};

// Fallback quotes in case the API fails
const FALLBACK_QUOTES: Quote[] = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    tags: ["inspirational", "motivational"],
    _id: "fallback-1"
  },
  {
    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill", 
    tags: ["motivational", "failure"],
    _id: "fallback-2"
  },
  {
    content: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    tags: ["inspirational", "motivational"],
    _id: "fallback-3"
  },
  {
    content: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    tags: ["motivational", "inspirational"],
    _id: "fallback-4"
  },
  {
    content: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    tags: ["inspirational", "motivational"],
    _id: "fallback-5"
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route called:', req.method, req.url);
  
  // Always return fallback quotes for now (we'll add external API later)
  const fallbackResponse: QuotesResponse = {
    results: FALLBACK_QUOTES,
    count: FALLBACK_QUOTES.length,
    totalCount: FALLBACK_QUOTES.length,
    page: 1,
    totalPages: 1,
    lastItemIndex: FALLBACK_QUOTES.length - 1
  };
  
  res.status(200).json(fallbackResponse);
}
