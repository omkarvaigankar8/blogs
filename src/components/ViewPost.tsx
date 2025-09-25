import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import type{ ViewPostProps } from '@/types';

const ViewPost: React.FC<ViewPostProps> = ({ post, open, onClose }) => {
  if (!post) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">{post.title}</Typography>
          <Chip
            label={post.status}
            color={post.status === 'published' ? 'success' : 'default'}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPost;