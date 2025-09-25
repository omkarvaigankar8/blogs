import React from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
  ThemeProvider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, LightMode, DarkMode } from '@mui/icons-material';
import { lightTheme, darkTheme } from '@/components/UI/theme';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { usePopup } from '@/hooks/usePopup';
import BlogTable from '@/components/BlogTable';
import CommonPopup from '@/components/UI/Popup';
import { BlogPost, BlogFormData } from '@/types';

// Initial mock data
const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with React',
    author: 'John Doe',
    content: 'React is a popular JavaScript library for building user interfaces. It allows you to create reusable components and build complex UIs from small, isolated pieces of code.',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'Material UI Best Practices',
    author: 'Jane Smith',
    content: 'Material UI provides a comprehensive set of components that follow Google\'s Material Design guidelines. It offers theming, responsive design, and accessibility out of the box.',
    status: 'draft',
    createdAt: '2024-01-10',
  },
  {
    id: 3,
    title: 'TypeScript for React Developers',
    author: 'Mike Johnson',
    content: 'TypeScript brings static type checking to JavaScript, helping catch errors early and improving code maintainability. When combined with React, it provides excellent developer experience.',
    status: 'published',
    createdAt: '2024-01-20',
  },
];

const App: React.FC = () => {
  const [posts, setPosts] = useLocalStorage<BlogPost[]>('blogPosts', initialPosts);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  
  const { popupState, openPopup, closePopup } = usePopup();

  const handleSavePost = (formData: BlogFormData): void => {
    if (popupState.type === 'edit' && popupState.data) {
      // Edit existing post
      setPosts(posts.map(post =>
        post.id === popupState.data!.id
          ? { ...formData, id: popupState.data!.id, createdAt: popupState.data!.createdAt }
          : post
      ));
    } else {
      // Add new post
      const newPost: BlogPost = {
        ...formData,
        id: Math.max(...posts.map(p => p.id), 0) + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPosts([...posts, newPost]);
    }
  };

  const handleDeletePost = (): void => {
    if (popupState.data) {
      setPosts(posts.filter(post => post.id !== popupState.data!.id));
    }
  };

  const handlePopupConfirm = (formData?: BlogFormData) => {
    switch (popupState.type) {
      case 'create':
      case 'edit':
        if (formData) {
          handleSavePost(formData);
        }
        break;
      case 'delete':
        handleDeletePost();
        break;
      default:
        break;
    }
  };

  const handleAddPost = (): void => {
    openPopup('create');
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh',minWidth:'100%' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blog Dashboard
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  icon={<LightMode sx={{position:'relative',top:'-2px'}} />}
                  checkedIcon={<DarkMode sx={{position:'relative',top:'-2px'}} />}
                />
              }
              label={darkMode ? 'Dark' : 'Light'}
              sx={{ mr: 2 }}
            />
            <Button
              color="inherit"
              startIcon={<Add />}
              onClick={handleAddPost}
              variant="outlined"
            >
              Add Post
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} disableGutters sx={{ mt: 4, mb: 4, px: 4 }}>
          <BlogTable
            posts={posts}
            onPopupOpen={openPopup}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Container>

        <CommonPopup
          open={popupState.isOpen}
          onClose={closePopup}
          type={popupState.type}
          data={popupState.data}
          onConfirm={handlePopupConfirm}
          title={popupState.type === 'delete' ? 'Delete Post' : undefined}
          message={
            popupState.type === 'delete' 
              ? `Are you sure you want to delete "${popupState.data?.title}"? This action cannot be undone.`
              : undefined
          }
        />
      </Box>
    </ThemeProvider>
  );
};

export default App;