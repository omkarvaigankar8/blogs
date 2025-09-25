import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  IconButton,
  Chip,
  Box,
  TablePagination,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { BlogTableProps, BlogPost, PopupType } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

type Order = 'asc' | 'desc';
type SortableField = 'title' | 'date';

const BlogTable: React.FC<BlogTableProps> = ({ 
  posts, 
  onPopupOpen,
  searchTerm,
  onSearchChange 
}) => {
  const [orderBy, setOrderBy] = useState<SortableField>('date');
  const [order, setOrder] = useState<Order>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedInput !== searchTerm) {
      onSearchChange(debouncedInput);
    }
  }, [debouncedInput, onSearchChange, searchTerm]);

  const handleSort = (property: SortableField) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleActionClick = (type: PopupType, post: BlogPost) => {
    onPopupOpen(type, post);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPosts = filteredPosts.sort((a, b) => {
    if (orderBy === 'title') {
      return order === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (orderBy === 'date') {
      return order === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const paginatedPosts = sortedPosts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          label="Search by title or author"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          fullWidth
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>Author</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'desc'}
                  onClick={() => handleSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPosts.map((post) => (
              <TableRow key={post.id} hover>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={post.status}
                    color={post.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    onClick={() => handleActionClick('view', post)} 
                    color="primary"
                    title="View post"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleActionClick('edit', post)} 
                    color="secondary"
                    title="Edit post"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleActionClick('delete', post)} 
                    color="error"
                    title="Delete post"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPosts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default BlogTable;