import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogFormSchema, BlogFormData } from '@/lib/schemas/blogSchema';
import type { CommonPopupProps} from '@/types';

const CommonPopup: React.FC<CommonPopupProps> = ({
  open,
  onClose,
  type,
  data,
  onConfirm,
  title,
  message,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: data?.title || '',
      author: data?.author || '',
      content: data?.content || '',
      status: data?.status || 'draft',
    },
  });

  React.useEffect(() => {
    if (type === 'create' || type === 'edit') {
      reset({
        title: data?.title || '',
        author: data?.author || '',
        content: data?.content || '',
        status: data?.status || 'draft',
      });
    }
  }, [data, type, reset, open]);

  const handleFormSubmit = (formData: BlogFormData) => {
    onConfirm?.(formData);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const getPopupTitle = (): string => {
    switch (type) {
      case 'create':
        return 'Add New Blog Post';
      case 'edit':
        return 'Edit Blog Post';
      case 'delete':
        return title || 'Delete Post';
      case 'view':
        return data?.title || 'View Post';
      default:
        return '';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'create':
      case 'edit':
        return (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                {type === 'edit' ? 'Update' : 'Save'}
              </Button>
            </DialogActions>
          </form>
        );

      case 'delete':
        return (
          <>
            <DialogContent>
              <DialogContentText>
                {message || `Are you sure you want to delete "${data?.title}"?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleConfirm} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </>
        );

      case 'view':
        if (!data) return null;
        
        return (
          <>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={data.status}
                    color={data.status === 'published' ? 'success' : 'default'}
                  />
                </Box>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  By {data.author} • {new Date(data.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {data.content}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Close</Button>
            </DialogActions>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={type === 'view' ? 'md' : 'sm'} 
      fullWidth
    >
      <DialogTitle>{getPopupTitle()}</DialogTitle>
      {renderContent()}
    </Dialog>
  );
};

export default CommonPopup;