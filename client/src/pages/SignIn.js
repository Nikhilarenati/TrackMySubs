import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'

const SignIn = ({ onAuthSuccess, themeMode, onToggleTheme }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      setLoading(true)
      const { data } = await axios.post('/api/auth/login', { email, password })
      onAuthSuccess(data.token, data.user)
      navigate('/', { replace: true })
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2
      }}
    >
      <Button
        variant='outlined'
        color='inherit'
        onClick={onToggleTheme}
        sx={{
          position: 'absolute',
          right: { xs: 16, md: 24 },
          top: { xs: 16, md: 24 }
        }}
      >
        {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>

      <Paper
        variant='outlined'
        sx={{
          width: '100%',
          maxWidth: 440,
          p: 4,
          borderRadius: 4,
          bgcolor: 'background.paper',
          boxShadow: 1
        }}
      >
        <Typography variant='h4' sx={{ mb: 0.5, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Welcome back
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          Sign in to manage your subscriptions.
        </Typography>

        <Box component='form' sx={{ display: 'grid', gap: 2 }} onSubmit={handleSubmit}>
          {error ? <Alert severity='error'>{error}</Alert> : null}

          <TextField
            label='Email'
            type='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            required
          />

          <TextField
            label='Password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            required
          />

          <Button type='submit' variant='contained' fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>

        <Typography variant='body2' color='text.secondary' sx={{ mt: 2.5, textAlign: 'center' }}>
          New here?{' '}
          <Link
            to='/signup'
            style={{
              fontWeight: 500,
              textDecoration: 'underline',
              color: 'inherit'
            }}
          >
            Create an account
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default SignIn
