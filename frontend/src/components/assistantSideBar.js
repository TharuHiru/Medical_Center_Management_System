'use client';

import {
  AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery,
  useTheme, Collapse,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUser, FaCalendarCheck, FaBoxes } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const AssistSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const pathname = usePathname();

  const tabMap = {
    '/AssistantDashboard/dashboard': 'Dashboard',
    '/AssistantDashboard/patientManagement': 'Patients',
    '/AssistantDashboard/appointmentManagement/queue': 'Queue',
    '/AssistantDashboard/appointmentManagement/prescriptions': 'Prescriptions',
    '/AssistantDashboard/inventoryManagement/inventoryRecords': 'Inventory Records',
    '/AssistantDashboard/inventoryManagement/medicineCategory': 'Medicine Category',
  };

  const currentTab = tabMap[pathname] || 'Dashboard';

  const toggleDrawer = () => setOpen(!open);
  const handleInventoryClick = () => setInventoryOpen(!inventoryOpen);
  const handleAppointmentsClick = () => setAppointmentsOpen(!appointmentsOpen);

  useEffect(() => {
    // Expand the relevant section if a child path is selected
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
  ];

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2, color: '#ffffff' }}
            >
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
        ModalProps={{ keepMounted: true }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {currentTab}
        </Typography>
        <hr />

        <List>
          {links.map(({ href, text, icon, children }) => (
            <React.Fragment key={text}>
              {!children ? (
                <ListItemButton
                  component={Link}
                  href={href}
                  selected={pathname === href}
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
                  <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
                  <ListItemText primary={text} primaryTypographyProps={{ sx: { color: 'white', fontSize: '20px' } }} />
                </ListItemButton>
              ) : (
                <>
                  <ListItemButton
                    onClick={text === 'Appointments' ? handleAppointmentsClick : handleInventoryClick}
                    sx={{ '&:hover': { backgroundColor: '#1a3c42' } }}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ sx: { color: 'white', fontSize: '20px' } }} />
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
                          pl: 4,
                          backgroundColor: pathname === subHref ? '#1a3c42' : 'inherit',
                          '&:hover': { backgroundColor: '#1a3c42' },
                          '&.Mui-selected': {
                            backgroundColor: '#1a3c42 !important',
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: '#1a3c42',
                          },
                        }}
                      >
                        <ListItemText
                          primary={subText}
                          primaryTypographyProps={{ sx: { color: 'white', fontSize: '18px' } }}
                        />
                      </ListItemButton>
                    ))}
                  </Collapse>
                </>
              )}
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default AssistSidebar;
