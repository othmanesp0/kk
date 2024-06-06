import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile, logoutUser } from '../actions/userActions';
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
    Alert,
    ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { createSelector } from 'reselect';
import dynamic from 'next/dynamic';
import { RootState } from '../reducers';

const Dashboard = dynamic(() => import('./Dashboard'));

const drawerWidth = 240;

const selectUserAndAuthState = createSelector(
    (state: RootState) => ({
        profile: state.user.profile,
        loading: state.user.loading,
        isAuthenticated: state.auth.isAuthenticated
    }),
    userAndAuth => userAndAuth
);

const HomeGuard: React.FC = () => {
    const dispatch = useDispatch();
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

    return (
        <div>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        HomeGuard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    ...(open && { display: 'none' }),
                }}
                open={open}
            >
                <Toolbar>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <List>
                    <ListItemButton>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText primary="School" />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            <ForumIcon />
                        </ListItemIcon>
                        <ListItemText primary="Forum" />
                    </ListItemButton>
                </List>
                <Box sx={{ flexGrow: 1 }} />
                <List>
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Dashboard />
            </Box>
        </div>
    );
};

export default HomeGuard;
