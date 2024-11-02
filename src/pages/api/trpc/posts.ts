import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined;
    }
  }
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (typeof global !== 'undefined') {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
}

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
  } else if (req.method === 'POST') {
    try {
      const { name }: { name: string } = req.body as { name: string };
      if (!name) {
        return res.status(400).json({ error: 'Post name is required' });
      }
      const newPost = await prisma.post.create({
        data: { name },
      });
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating new post:', error);
      res.status(500).json({ error: 'Error creating new post' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...data }: { id: string; [key: string]: unknown } = req.body as { id: string; [key: string]: unknown };
      if (!id) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      const updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data,
      });
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Error updating post' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id }: { id: string } = req.body as { id: string };
      if (!id) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      await prisma.post.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Error deleting post' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
