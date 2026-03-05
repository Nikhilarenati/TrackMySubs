import React from 'react'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'

const Navbar = ({ onLogout, themeMode, onToggleTheme }) => {
  return (
    <AppBar
      position='sticky'
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.primary',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Toolbar
        sx={{
          mx: 'auto',
          width: '100%',
          maxWidth: 1200,
          px: { xs: 3, md: 4 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
          TrackMySubs
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant='outlined' color='inherit' onClick={onToggleTheme}>
            {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button variant='outlined' color='inherit' onClick={onLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
