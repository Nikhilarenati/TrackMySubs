import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Alert, Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import Navbar from '../components/Navbar'
import SubCard from '../components/SubCard'
import AddSubModal from '../components/AddSubModal'
import { isDeadlineUrgent } from '../utils/dateUtils'

const Home = ({ onLogout, themeMode, onToggleTheme }) => {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const sortedSubs = useMemo(() => {
    const getDeadlineDate = (sub) => (sub.isTrial ? sub.trialEndsAt || sub.renewsAt : sub.renewsAt)

    return [...subs].sort((a, b) => {
      const aUrgent = isDeadlineUrgent(getDeadlineDate(a))
      const bUrgent = isDeadlineUrgent(getDeadlineDate(b))

      if (aUrgent !== bUrgent) {
        return aUrgent ? -1 : 1
      }

      return new Date(getDeadlineDate(a)) - new Date(getDeadlineDate(b))
    })
  }, [subs])

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await axios.get('/api/subs')
        setSubs(data.subs || [])
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Could not load subscriptions.')
      } finally {
        setLoading(false)
      }
    }

    fetchSubs()
  }, [])

  const handleCreated = (createdSub) => {
    setSubs((prev) => [...prev, createdSub])
  }

  const handleUpdated = (updatedSub) => {
    setSubs((prev) => prev.map((item) => (item._id === updatedSub._id ? updatedSub : item)))
  }

  const handleDeleted = (deletedId) => {
    setSubs((prev) => prev.filter((item) => item._id !== deletedId))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onLogout={onLogout} themeMode={themeMode} onToggleTheme={onToggleTheme} />

      <Box sx={{ mx: 'auto', width: '100%', maxWidth: 1200, px: { xs: 3, md: 4 }, py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Your Subscriptions
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mt: 0.5 }}>
              Watch trials, avoid hidden charges, split bills clearly.
            </Typography>
          </Box>
          <Button variant='contained' onClick={() => setModalOpen(true)}>
            Add Subscription
          </Button>
        </Box>

        {error ? (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : null}

        {loading ? (
          <Box
            sx={{
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <CircularProgress size={28} />
          </Box>
        ) : null}

        {!loading && sortedSubs.length === 0 ? (
          <Box
            sx={{
              borderRadius: 4,
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              p: 5,
              textAlign: 'center'
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: 500 }}>
              No subscriptions yet
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Add your first subscription to start tracking trials and sharing.
            </Typography>
          </Box>
        ) : null}

        {!loading && sortedSubs.length > 0 ? (
          <Grid container spacing={2.5}>
            {sortedSubs.map((sub) => (
              <Grid item key={sub._id} xs={12} md={6} xl={4}>
                <SubCard sub={sub} onUpdated={handleUpdated} onDeleted={handleDeleted} />
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>

      <AddSubModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </Box>
  )
}

export default Home
