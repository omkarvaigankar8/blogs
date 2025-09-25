import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogFormSchema, BlogFormData } from '@/lib/schemas/blogSchema';
import type{ BlogFormProps } from '@/types';

const BlogForm: React.FC<BlogFormProps> = ({ open, onClose, onSave, editPost }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      author: '',
      content: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (editPost) {
      reset({
        title: editPost.title,
        author: editPost.author,
        content: editPost.content,
        status: editPost.status,
      });
    } else {
      reset({
        title: '',
        author: '',
        content: '',
        status: 'draft',
      });
    }
  }, [editPost, open, reset]);

  const onSubmit = (data: BlogFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editPost ? 'Edit Blog Post' : 'Add New Blog Post'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                />
              )}
            />
            
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Author"
                  error={!!errors.author}
                  helperText={errors.author?.message}
                  fullWidth
                />
              )}
            />
            
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Content"
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  multiline
                  rows={6}
                  fullWidth
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" variant="contained">
            {editPost ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BlogForm;