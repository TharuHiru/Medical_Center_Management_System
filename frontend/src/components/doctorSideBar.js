'use client';

import {
  AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUser, FaCalendarCheck } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import '../Styles/sideNavBar.css';

const AssistSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen is mobile
  const [open, setOpen] = useState(true); // Sidebar open state
  const pathname = usePathname();

  const tabMap = {
    '/DoctorDashboard/Dashboard': 'Dashboard',
    '/DoctorDashboard/patientManage': 'Patients',
    '/DoctorDashboard/appointmentManage': 'Appointments',
    '/DoctorDashboard/assistantManage': 'Assistants',
  };

  const currentTab = tabMap[pathname] || 'Dashboard';

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const links = [
    { href: '/DoctorDashboard/Dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/DoctorDashboard/patientManage', text: 'Patients', icon: <FaUser /> },
    { href: '/DoctorDashboard/appointmentManage', text: 'Appointments', icon: <FaCalendarCheck /> },
    { href: '/DoctorDashboard/assistantManage', text: 'Assistants', icon: <FaUser /> },
  ];

  return (
    <Box>
      {/* Render AppBar only for mobile screens */}
      {isMobile && (
        <AppBar position="sticky" sx={{ backgroundColor: 'rgb(48, 90, 99)', zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={toggleDrawer} aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: open ? 240 : 60, // Adjust width based on open state
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? 240 : 60, // Adjust width based on open state
            boxSizing: 'border-box',
            backgroundColor: 'rgb(48, 90, 99)',
            color: 'white',
            paddingTop: '20px',
            overflowX: 'hidden', // Prevent content overflow
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '0 10px' }}>
          <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        {open && (
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold',backgroundColor: '#1a3c42', padding: '10px' ,marginBottom: '10px' }}>
            {currentTab}
          </Typography>
        )}
        <Divider />

        {/* Sidebar Links */}
        <List>
          {links.map(({ href, text, icon }) => (
            <React.Fragment key={text}>
              <ListItemButton
                component={Link}
                href={href}
                selected={pathname === href} // Highlight selected tab
                sx={{
                  backgroundColor: pathname === href ? '#1a3c42' : 'inherit',
                  '&:hover': { backgroundColor: '#1a3c42' },
                  '&.Mui-selected': {
                    backgroundColor: '#1a3c42 !important',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#1a3c42',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', fontSize: '20px' }}>{icon}</ListItemIcon>
                {open && (
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      sx: {
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '20px',
                      },
                    }}
                  />
                )}
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        {open && (
          <Box className="logout-container" sx={{ textAlign: 'center', marginTop: '320px' }}>
            <button className="logout-button" style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Log Out
            </button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default AssistSidebar;