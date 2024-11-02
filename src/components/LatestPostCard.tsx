import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  TextField,
  Stack
} from '@mui/material';

type Post = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
};

const LatestPostCard: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  useEffect(() => {
    async function fetchLatestPost() {
      try {
        const response = await fetch('/api/trpc/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch latest post');
        }
        const data = (await response.json()) as Post;
        setPost(data);
        setEditName(data.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    void fetchLatestPost();
  }, []);

  const handleUpdate = async () => {
    if (!post) return;
    try {
      const response = await fetch('/api/trpc/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: post.id, name: editName }),
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      const updatedPost = (await response.json()) as Post;
      setPost(updatedPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    try {
      const response = await fetch('/api/trpc/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: post.id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPost(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

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
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Edit Post Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                fullWidth
              />
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Post
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete Post
              </Button>
            </Stack>
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
