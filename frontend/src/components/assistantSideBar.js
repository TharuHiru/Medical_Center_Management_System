'use client';

import {
  AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery,useTheme, Collapse,} from '@mui/material';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaTachometerAlt, FaUser, FaCalendarCheck, FaBoxes } from 'react-icons/fa';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import '@/Styles/sideNavBar.css'; 
import { useAuth } from "@/context/AuthContext"; 
import Swal from 'sweetalert2';

const AssistSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const tabMap = {
    '/AssistantDashboard/dashboard': 'Dashboard',
    '/AssistantDashboard/patientManagement': 'Patients',
    '/AssistantDashboard/appointmentManagement/queue': 'Queue',
    '/AssistantDashboard/appointmentManagement/prescriptions': 'Prescriptions',
    '/AssistantDashboard/inventoryManagement/inventoryRecords': 'Inventory Records',
    '/AssistantDashboard/inventoryManagement/medicineCategory': 'Medicine Category',
    '/AssistantDashboard/reports': 'Reports',
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
             router.push('/AssistantLogin');
           }
         });
       };

  const handleInventoryClick = () => setInventoryOpen(!inventoryOpen);
  const handleAppointmentsClick = () => setAppointmentsOpen(!appointmentsOpen);

  useEffect(() => {
    if (pathname.startsWith('/AssistantDashboard/appointmentManagement')) {
      setAppointmentsOpen(true);
    }
    if (pathname.startsWith('/AssistantDashboard/inventoryManagement')) {
      setInventoryOpen(true);
    }
  }, [pathname]);

  const links = [
    { href: '/AssistantDashboard/dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/AssistantDashboard/patientManagement', text: 'Patients', icon: <FaUser /> },
    {
      text: 'Appointments',
      icon: <FaCalendarCheck />,
      children: [
        { href: '/AssistantDashboard/appointmentManagement/queue', text: 'Queue' },
        { href: '/AssistantDashboard/appointmentManagement/prescriptions', text: 'Prescriptions' },
      ],
    },
    {
      text: 'Inventory',
      icon: <FaBoxes />,
      children: [
        { href: '/AssistantDashboard/inventoryManagement/inventoryRecords', text: 'Inventory Records' },
        { href: '/AssistantDashboard/inventoryManagement/medicineCategory', text: 'Medicine Category' },
      ],
    },
    { href: '/AssistantDashboard/reports', text: 'Reports', icon: <FaTachometerAlt /> },
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
          {links.map(({ href, text, icon, children }) => (
            <React.Fragment key={text}>
              {!children ? (
                <ListItemButton
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
              ) : (
                <>
                  <ListItemButton
                    onClick={text === 'Appointments' ? handleAppointmentsClick : handleInventoryClick}
                    sx={{
                      borderRadius: '12px',
                      mx: 1,
                      my: 0.5,
                      '&:hover': { backgroundColor: '#1a3c42', transform: 'scale(1.01)' },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ fontSize: '18px', fontWeight: 500 }} />
                    {(text === 'Appointments' ? appointmentsOpen : inventoryOpen)
                      ? <ExpandLess sx={{ color: 'white' }} />
                      : <ExpandMore sx={{ color: 'white' }} />}
                  </ListItemButton>

                  <Collapse in={text === 'Appointments' ? appointmentsOpen : inventoryOpen} timeout="auto" unmountOnExit>
                    {children.map(({ href: subHref, text: subText }) => (
                      <ListItemButton
                        key={subText}
                        component={Link}
                        href={subHref}
                        selected={pathname === subHref}
                        sx={{
                          pl: 6,
                          py: 1,
                          mx: 2,
                          borderRadius: '8px',
                          backgroundColor: pathname === subHref ? '#244a53' : 'transparent',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#2e5e68',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={subText}
                          primaryTypographyProps={{ fontSize: '16px', fontWeight: 400 }}
                        />
                      </ListItemButton>
                    ))}
                  </Collapse>
                </>
              )}
            </React.Fragment>
          ))}
        </List>

        <Box className="logout-container" sx={{ textAlign: 'center', mt: 'auto', pb: 3 }}>
          <button className="logout-button" onClick={handleLogout} >Log Out</button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AssistSidebar;
