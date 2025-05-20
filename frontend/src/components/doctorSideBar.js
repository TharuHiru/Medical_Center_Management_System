'use client';

import {
  AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton,ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery, useTheme} from '@mui/material';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaTachometerAlt, FaUser, FaCalendarCheck } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import '@/Styles/sideNavBar.css';
import { useAuth } from "@/context/AuthContext"; 
import Swal from 'sweetalert2';

const DoctorSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const tabMap = {
    '/DoctorDashboard/Dashboard': 'Dashboard',
    '/DoctorDashboard/patientManage': 'Patients',
    '/DoctorDashboard/appointmentManage': 'Appointments',
    '/DoctorDashboard/assistantManage': 'Assistants',
    '/DoctorDashboard/reports': 'Reports',
  };

  const currentTab = tabMap[pathname] || 'Dashboard';

  const toggleDrawer = () => setOpen(!open);

    const handleLogout = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout',
        background: '#203a43',
        color: 'white',
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
          router.push('/DoctorLogin');
        }
      });
    };

  const links = [
    { href: '/DoctorDashboard/Dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/DoctorDashboard/patientManage', text: 'Patients', icon: <FaUser /> },
    { href: '/DoctorDashboard/appointmentManage', text: 'Appointments', icon: <FaCalendarCheck /> },
    { href: '/DoctorDashboard/assistantManage', text: 'Assistants', icon: <FaUser /> },
    { href: '/DoctorDashboard/reports', text: 'Reports', icon: <FaUser /> },
  ];

  return (
    <Box>
      <AppBar position="sticky" sx={{ background: 'linear-gradient(to right, #2c5364, #203a43, #0f2027)' }}>
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
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            background: 'rgba(32, 58, 67, 0.9)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            boxShadow: '4px 0 10px rgba(0,0,0,0.3)',
            paddingTop: '20px',
            borderRight: '1px solid rgba(255,255,255,0.1)',
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 600, mb: 2 }}>
          {currentTab}
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <List>
          {links.map(({ href, text, icon }) => (
            <ListItemButton
              key={text}
              component={Link}
              href={href}
              selected={pathname === href}
              sx={{
                borderRadius: '12px',
                mx: 1,
                my: 0.5,
                transition: 'all 0.3s ease',
                backgroundColor: pathname === href ? '#1a3c42' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1a3c42',
                  transform: 'scale(1.02)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
              <ListItemText primary={text} primaryTypographyProps={{ fontSize: '18px', fontWeight: 500 }} />
            </ListItemButton>
          ))}
        </List>

        <Box className="logout-container" sx={{ textAlign: 'center', mt: 'auto', pb: 3 }}>
          <button className="logout-button"  onClick={handleLogout} >Log Out</button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DoctorSidebar;
