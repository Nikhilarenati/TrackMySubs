import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'

const SignUp = ({ onAuthSuccess, themeMode, onToggleTheme }) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      setLoading(true)
      const { data } = await axios.post('/api/auth/signup', { name, email, password })
      onAuthSuccess(data.token, data.user)
      navigate('/', { replace: true })
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Signup failed. Please try again.')
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
          Create account
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          Start guarding your wallet with TrackMySubs.
        </Typography>

        <Box component='form' sx={{ display: 'grid', gap: 2 }} onSubmit={handleSubmit}>
          {error ? <Alert severity='error'>{error}</Alert> : null}

          <TextField
            label='Name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
          />

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
            helperText='Use at least 6 characters'
            fullWidth
            required
          />

          <Button type='submit' variant='contained' fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </Box>

        <Typography variant='body2' color='text.secondary' sx={{ mt: 2.5, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link
            to='/signin'
            style={{
              fontWeight: 500,
              textDecoration: 'underline',
              color: 'inherit'
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default SignUp
