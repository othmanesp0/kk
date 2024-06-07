import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile, logoutUser } from '../slices/userSlice';
import {
  Box,
  CircularProgress,
  Drawer,
  List,
  ListItemText,
  ListItemIcon,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  ListItemButton,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createSelector } from 'reselect';
import { RootState } from '../types/store/courseSlice';
import { useRouter } from 'next/router';
import { Navigate } from 'react-router-dom';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('./Dashboard'));
const drawerWidth = 240;

const selectUserAndAuthState = createSelector(
  (state: RootState) => ({
    profile: state.user.profile,
    loading: state.user.loading,
    isAuthenticated: state.auth.isAuthenticated,
  }),
  (userAndAuth) => userAndAuth
);

const HomeGuard: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile, loading, isAuthenticated } = useSelector(selectUserAndAuthState);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <Box
        className="flex justify-center items-center h-1/2"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (profile && profile.role !== 'admin') {
    return (
      <Box
        className="flex justify-center items-center h-1/2"
      >
        <Typography variant="h6" className="text-gray-700">You are not authorized.</Typography>
      </Box>
    );
  }

  const drawerContent = (
    <div className="bg-gray-200 h-screen">
      <Toolbar className="bg-gray-700 text-white">
        <IconButton
          onClick={handleDrawerClose}
          className="text-white"
        >
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <List>
        <ListItemButton
          component={Link}
          href="/"
          className="hover:bg-gray-300"
        >
          <ListItemIcon>
            <HomeIcon className="text-gray-700" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          href="/courses"
          className="hover:bg-gray-300"
        >
          <ListItemIcon>
            <SchoolIcon className="text-gray-700" />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          href="/forums"
          className="hover:bg-gray-300"
        >
          <ListItemIcon>
            <ForumIcon className="text-gray-700" />
          </ListItemIcon>
          <ListItemText primary="Forum" />
        </ListItemButton>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <ListItemButton
          component={Link}
          href="/profile"
          className="hover:bg-gray-300"
        >
          <ListItemIcon>
            <AccountCircleIcon className="text-gray-700" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box className="flex">
      <CssBaseline />
      <AppBar position="fixed" open={open} className="bg-blue-500">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
            className="text-white"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="text-white">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
      >
        {drawerContent}
      </Drawer>
      <Dashboard />
    </Box>
  );
};

export default HomeGuard;