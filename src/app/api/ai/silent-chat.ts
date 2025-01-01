import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { expression, gesture } = req.body;

  if (expression) {
    return res.status(200).json({ reply: `I see you're feeling ${expression}.` });
  }

  if (gesture) {
    return res.status(200).json({ reply: `You made a ${gesture} gesture.` });
  }

  return res.status(400).json({ error: 'No valid input detected.' });
}
