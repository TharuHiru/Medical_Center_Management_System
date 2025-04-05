'use client';

import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Tour Management'); // Default selected tab

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName); // Update the selected tab
    if (isMobile) setOpen(false); // Close drawer on mobile after selection
  };

  return (
    <Box>
      {/* AppBar for both mobile and desktop */}
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={toggleDrawer} aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          {/* Show selected tab name at the top of the navigation bar */}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#333',
            color: 'white',
            paddingTop: '20px',
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Typography variant="h5" sx={{  textAlign: 'center' }}>
            {selectedTab}
          </Typography>
          <hr></hr>
        <List>
          <ListItem button onClick={() => handleTabClick('Tour Management')}>
            <ListItemIcon><ListAltIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Tour Management" />
          </ListItem>
          <Divider />

          <ListItem button onClick={() => handleTabClick('Guide Management')}>
            <ListItemIcon><PersonIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Guide Management" />
          </ListItem>
          <Divider />

          <ListItem button onClick={() => handleTabClick('User Management')}>
            <ListItemIcon><PersonIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>

          <ListItem button onClick={() => handleTabClick('Payment Management')}>
            <ListItemIcon><PaymentIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Payment Management" />
          </ListItem>
          <Divider />

          <ListItem button onClick={() => handleTabClick('Complaint Management')}>
            <ListItemIcon><InfoIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary="Complaint Management" />
          </ListItem>
          <Divider />
        </List>
      </Drawer>

      
    </Box>
  );
};

export default Sidebar;
