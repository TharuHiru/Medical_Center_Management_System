'use client';

import {
  AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemIcon,
  ListItemText, Toolbar, Typography, useMediaQuery, useTheme, Collapse,
} from '@mui/material';
import React, { useState } from 'react';
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
  const pathname = usePathname();

  const tabMap = {
    '/AssistantDashboard/dashboard': 'Dashboard',
    '/AssistantDashboard/patientManagement': 'Patients',
    '/AssistantDashboard/appointmentManagement': 'Appointments',
    '/AssistantDashboard/inventoryManagement/': 'Inventory Records',
    '/AssistantDashboard/medicineCategory': 'Medicine Category',
  };

  const currentTab = tabMap[pathname] || 'Dashboard';

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleInventoryClick = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const links = [
    { href: '/AssistantDashboard/dashboard', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/AssistantDashboard/patientManagement', text: 'Patients', icon: <FaUser /> },
    { href: '/AssistantDashboard/appointmentManagement', text: 'Appointments', icon: <FaCalendarCheck /> },
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
                <ListItem
                  button
                  component={Link}
                  href={href}
                  selected={pathname === href}
                  sx={{
                    '&.Mui-selected': { backgroundColor: '#1a3c42' },
                    '&.Mui-selected:hover': { backgroundColor: '#1a3c42' },
                    '&:hover': { backgroundColor: '#1a3c42' },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
                  <ListItemText primary={text} primaryTypographyProps={{ sx: { color: 'white', fontSize: '20px' } }} />
                </ListItem>
              ) : (
                <>
                  <ListItem
                    button
                    onClick={handleInventoryClick}
                    sx={{ '&:hover': { backgroundColor: '#1a3c42' } }}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ sx: { color: 'white', fontSize: '20px' } }} />
                    {inventoryOpen ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                  </ListItem>

                  <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
                    {children.map(({ href: subHref, text: subText }) => (
                      <ListItem
                        key={subText}
                        button
                        component={Link}
                        href={subHref}
                        selected={pathname === subHref}
                        sx={{
                          pl: 4,
                          '&.Mui-selected': { backgroundColor: '#1a3c42' },
                          '&.Mui-selected:hover': { backgroundColor: '#1a3c42' },
                          '&:hover': { backgroundColor: '#1a3c42' },
                        }}
                      >
                        <ListItemText
                          primary={subText}
                          primaryTypographyProps={{ sx: { color: 'white', fontSize: '18px' } }}
                        />
                      </ListItem>
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
