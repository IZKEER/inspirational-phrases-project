import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🚀 API route is working!', req.method, req.url);
  
  res.status(200).json({ 
    message: 'API route is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
