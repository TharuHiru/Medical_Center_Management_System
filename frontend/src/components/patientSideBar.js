'use client';

import {
  AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUser, FaCalendarCheck, FaBoxes } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import '../Styles/sideNavBar.css';
import { Button } from 'bootstrap/dist/js/bootstrap.bundle.min';

const PatientSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const tabMap = {
    '/patientDashboard/dashboard': 'Dashboard',
    '/patientDashboard/profile': 'Profile',
    '/patientDashboard/appoinments': 'Appointments',
  };

  const currentTab = tabMap[pathname] || 'Dashboard';

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const links = [
    { href: '/patientDashboard/dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/patientDashboard/profile', text: 'Profile', icon: <FaUser /> },
    { href: '/patientDashboard/appoinments', text: 'Appointments', icon: <FaCalendarCheck /> },
  ];

  return (
    <Box>
      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: 'rgb(48, 90, 99)',
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
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {currentTab}
        </Typography>
        <hr />

        {/* Sidebar Links */}
        <List>
          {links.map(({ href, text, icon }) => (
            <React.Fragment key={text}>
              <ListItemButton
                component={Link}
                href={href}
                selected={pathname === href} // highlight selected tab
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
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <button> LogOut </button>
      </Drawer>
    </Box>
  );
};

export default PatientSidebar;
