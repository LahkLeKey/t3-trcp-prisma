import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


const prisma =
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(post ?? { message: 'No posts available' });
    } catch (error) {
      console.error('Error fetching latest post:', error);
      res.status(500).json({ error: 'Error fetching latest post' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
