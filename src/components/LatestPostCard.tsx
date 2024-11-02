import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';

type Post = {
  name: string;
  createdAt: string;
  updatedAt?: string;
};

const LatestPostCard: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestPost() {
      try {
        const response = await fetch('/api/trpc/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch latest post');
        }
        const data = (await response.json()) as Post;
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    void fetchLatestPost();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">Error: {error}</Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        {post ? (
          <>
            <Typography variant="h5" component="div">
              {post.name}
            </Typography>
            <Typography color="text.secondary">
              Created at: {new Date(post.createdAt).toLocaleString()}
            </Typography>
            {post.updatedAt && (
              <Typography color="text.secondary">
                Updated at: {new Date(post.updatedAt).toLocaleString()}
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No posts found.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestPostCard;
