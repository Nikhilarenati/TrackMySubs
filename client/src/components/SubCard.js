import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { daysUntil, formatPretty, getDeadlineLevel, getTrialStatus } from '../utils/dateUtils'

const SubCard = ({ sub, onUpdated, onDeleted }) => {
  const [sharedWithInput, setSharedWithInput] = useState(String(sub.sharedWith || 1))
  const [isSavingSplit, setIsSavingSplit] = useState(false)
  const [splitError, setSplitError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setSharedWithInput(String(sub.sharedWith || 1))
  }, [sub.sharedWith])

  const trialStatus = useMemo(() => {
    if (!sub.isTrial) return null
    return getTrialStatus(sub.trialEndsAt)
  }, [sub.isTrial, sub.trialEndsAt])

  const renewDays = useMemo(() => {
    if (sub.isTrial) return null
    return daysUntil(sub.renewsAt)
  }, [sub.isTrial, sub.renewsAt])

  const renewLevel = useMemo(() => {
    if (sub.isTrial) return 'safe'
    return getDeadlineLevel(sub.renewsAt)
  }, [sub.isTrial, sub.renewsAt])

  const cardLevel = useMemo(() => {
    if (sub.isTrial) {
      return trialStatus?.isUrgent ? 'urgent' : 'safe'
    }
    return renewLevel
  }, [sub.isTrial, trialStatus, renewLevel])

  const shareValue = useMemo(() => {
    const split = Number(sharedWithInput)
    if (!Number.isFinite(split) || split < 1) return 1
    return Math.floor(split)
  }, [sharedWithInput])

  const yourShare = useMemo(() => {
    const price = Number(sub.price) || 0
    return (price / shareValue).toFixed(0)
  }, [sub.price, shareValue])

  const commitSharedWith = async () => {
    setSplitError('')

    const parsed = Number(sharedWithInput)
    const nextValue = Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1

    setSharedWithInput(String(nextValue))

    if (nextValue === sub.sharedWith) {
      return
    }

    try {
      setIsSavingSplit(true)
      const { data } = await axios.put(`/api/subs/${sub._id}`, { sharedWith: nextValue })
      onUpdated(data.sub)
    } catch (error) {
      setSplitError(error.response?.data?.message || 'Could not update shared count.')
      setSharedWithInput(String(sub.sharedWith || 1))
    } finally {
      setIsSavingSplit(false)
    }
  }

  const handleDelete = async () => {
    const shouldDelete = window.confirm(`Delete ${sub.name}?`)
    if (!shouldDelete) return

    try {
      setIsDeleting(true)
      await axios.delete(`/api/subs/${sub._id}`)
      onDeleted(sub._id)
    } catch (error) {
      setSplitError(error.response?.data?.message || 'Could not delete subscription.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Paper
      variant='outlined'
      sx={(theme) => ({
        borderRadius: 3,
        p: 2.5,
        boxShadow: theme.shadows[1],
        transition: 'all 180ms ease',
        ...(cardLevel === 'urgent' && {
          borderColor: alpha(theme.palette.error.main, 0.55),
          bgcolor: alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.2 : 0.08)
        }),
        ...(cardLevel === 'warning' && {
          borderColor: alpha(theme.palette.warning.main, 0.55),
          bgcolor: alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.2 : 0.08)
        }),
        ...(cardLevel === 'safe' && {
          borderColor: alpha(theme.palette.success.main, 0.45),
          bgcolor: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.18 : 0.06)
        })
      })}
    >
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {sub.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Total: ₹{sub.price} / {sub.billingCycle}
          </Typography>
        </Box>

        <Button color='error' size='small' variant='text' onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </Box>

      {sub.isTrial ? (
        <Alert severity={trialStatus?.isUrgent ? 'error' : 'success'} sx={{ mb: 2 }}>
          {trialStatus?.isUrgent ? 'CANCEL NOW' : 'Trial active'} - Trial ends in {trialStatus?.daysLeft} days (
          {formatPretty(sub.trialEndsAt)})
        </Alert>
      ) : (
        <Box
          sx={(theme) => ({
            mb: 2,
            px: 2,
            py: 1.1,
            borderRadius: 2,
            typography: 'body2',
            ...(renewLevel === 'urgent' && {
              color: theme.palette.error.dark,
              bgcolor: alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.25 : 0.12)
            }),
            ...(renewLevel === 'warning' && {
              color: theme.palette.warning.dark,
              bgcolor: alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.25 : 0.15)
            }),
            ...(renewLevel === 'safe' && {
              color: theme.palette.success.dark,
              bgcolor: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.25 : 0.14)
            })
          })}
        >
          Renews in {renewDays} days ({formatPretty(sub.renewsAt)})
        </Box>
      )}

      <Paper
        variant='outlined'
        sx={{
          borderRadius: 2.5,
          p: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            label='People'
            type='number'
            size='small'
            value={sharedWithInput}
            onChange={(event) => setSharedWithInput(event.target.value)}
            onBlur={commitSharedWith}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                commitSharedWith()
              }
            }}
            inputProps={{ min: 1 }}
            disabled={isSavingSplit}
            sx={{ width: 120 }}
          />

          <Typography variant='body1' sx={{ fontWeight: 500 }}>
            Your share: ₹{yourShare} / Total: ₹{sub.price}
          </Typography>
        </Box>

        {splitError ? (
          <Typography variant='body2' color='error' sx={{ mt: 1 }}>
            {splitError}
          </Typography>
        ) : null}
      </Paper>
    </Paper>
  )
}

export default SubCard
