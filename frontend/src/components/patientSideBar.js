'use client';

import {
  AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemIcon,
  ListItemText, Toolbar, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUser, FaCalendarCheck, FaBoxes } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';

const AssistSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const tabMap = {
    '/AssistantDashboard/dashboard': 'Dashboard',
    '/AssistantDashboard/patientManagement': 'Patients',
    '/AssistantDashboard/appointmentManagement': 'Appointments',
    '/AssistantDashboard/inventoryManagement': 'Inventory',
  };

  const currentTab = tabMap[pathname] || 'Dashboard';

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const links = [
    { href: '/AssistantDashboard/dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/AssistantDashboard/patientManagement', text: 'Patients', icon: <FaUser /> },
    { href: '/AssistantDashboard/appointmentManagement', text: 'Appointments', icon: <FaCalendarCheck /> },
    { href: '/AssistantDashboard/inventoryManagement', text: 'Inventory', icon: <FaBoxes /> },
  ];

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={toggleDrawer} aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

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
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {currentTab}
        </Typography>
        <hr />

        <List>
          {links.map(({ href, text, icon }) => (
            <React.Fragment key={text}>
            <Link href={href} passHref legacyBehavior>
        <ListItem
          component="a"
          sx={{
            backgroundColor: pathname === href ? '#555' : 'transparent', // ✅ highlight selected
            '&:hover': {
              backgroundColor: '#444',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
          <ListItemText
            primary={text}
            primaryTypographyProps={{
              sx: {
                color: 'white',
                textDecoration: 'none',
              },
            }}
          />
        </ListItem>
      </Link>

              
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default AssistSidebar;
