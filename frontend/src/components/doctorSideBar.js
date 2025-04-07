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
import '../Styles/sideNavBar.css'

const AssistSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const tabMap = {
    '/DoctorDashboard/dashboard': 'Dashboard',
    '/DoctorDashboard/patientManage': 'Patients',
    '/DoctorDashboard/appointmentManage': 'Appointments',
    '/DoctorDashboard/assistantManage': 'Assistants',
  };

  const currentTab = tabMap[pathname] || 'Dashboard';

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const links = [
    { href: '/DoctorDashboard/dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/DoctorDashboard/patientManage', text: 'Patients', icon: <FaUser /> },
    { href: '/DoctorDashboard/appointmentManage', text: 'Appointments', icon: <FaCalendarCheck /> },
    { href: '/DoctorDashboard/assistantManage', text: 'Assistants', icon: <FaUser /> },
  ];

  return (
    <Box >
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
        <Typography variant="h5" sx={{ textAlign: 'center' , fontWeight:'bold'}}>
          {currentTab}
        </Typography>
        <hr></hr>

        <List>
          {links.map(({ href, text, icon }) => (
            <React.Fragment key={text}>
              <Link href={href} passHref legacyBehavior>
                <ListItem
                  button
                  component="a"
                  selected={pathname === href}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#555',
                    },
                    '&:hover': {
                      backgroundColor: '#0f262a',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' , fontSize:'20px'}}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      sx: {
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize:'20px' 
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
