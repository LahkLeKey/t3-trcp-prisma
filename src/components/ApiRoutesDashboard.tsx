import React from 'react';
import { api } from '~/utils/api';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
} from '@mui/material';

const endpoints = [
  { label: 'Latest Post', query: api.post.getLatest.useQuery },
  { label: 'Hello Post', query: api.post.hello.useQuery, input: { text: 'from TRPC Dashboard' } },
];

const ApiRoutesDashboard: React.FC = () => {
  return (
    <Grid container spacing={2}>
      {endpoints.map((endpoint, index) => {
        const queryFn = endpoint.input ? endpoint.query(endpoint.input) : endpoint.query();
        const { data, isLoading, error } = queryFn;

        return (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{endpoint.label}</Typography>
                {isLoading && (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                    <CircularProgress />
                  </Box>
                )}
                {error && error instanceof Error && (
                  <Typography color="error">Error: {error.message}</Typography>
                )}
                {!isLoading && !error && data && (
                  <Typography variant="body2">
                    {JSON.stringify(data, null, 2)}
                  </Typography>
                )}
                {!isLoading && !error && !data && (
                  <Typography variant="body2" color="text.secondary">
                    No data available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ApiRoutesDashboard;
