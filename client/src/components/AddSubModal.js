import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField
} from '@mui/material'

const initialForm = {
  name: '',
  price: '',
  billingCycle: 'monthly',
  isTrial: false,
  trialEndsAt: '',
  renewsAt: '',
  sharedWith: '1'
}

const AddSubModal = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(initialForm)
      setError('')
    }
  }, [open])

  const canSubmit = useMemo(() => {
    if (!form.name.trim()) return false
    if (!form.renewsAt) return false
    if (!form.price || Number(form.price) <= 0) return false
    if (form.isTrial && !form.trialEndsAt) return false
    if (!form.sharedWith || Number(form.sharedWith) < 1) return false
    return true
  }, [form])

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!canSubmit) {
      setError('Please fill all required fields correctly.')
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        billingCycle: form.billingCycle,
        isTrial: form.isTrial,
        trialEndsAt: form.isTrial ? form.trialEndsAt : null,
        renewsAt: form.renewsAt,
        sharedWith: Math.max(1, Number(form.sharedWith) || 1)
      }

      const { data } = await axios.post('/api/subs', payload)
      onCreated(data.sub)
      onClose()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not add subscription.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Add Subscription</DialogTitle>
      <DialogContent dividers>
        <Box component='form' id='add-sub-form' onSubmit={handleSubmit} sx={{ mt: 0.5, display: 'grid', gap: 2 }}>
          {error ? <Alert severity='error'>{error}</Alert> : null}

          <TextField
            label='Name'
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
            fullWidth
          />

          <TextField
            label='Price (INR)'
            type='number'
            value={form.price}
            onChange={(event) => updateField('price', event.target.value)}
            inputProps={{ min: 1, step: '0.01' }}
            required
            fullWidth
          />

          <TextField
            select
            label='Billing Cycle'
            value={form.billingCycle}
            onChange={(event) => updateField('billingCycle', event.target.value)}
            fullWidth
          >
            <MenuItem value='monthly'>Monthly</MenuItem>
            <MenuItem value='yearly'>Yearly</MenuItem>
          </TextField>

          <FormControlLabel
            control={<Switch checked={form.isTrial} onChange={(event) => updateField('isTrial', event.target.checked)} />}
            label='Free Trial'
          />

          {form.isTrial ? (
            <TextField
              label='Trial Ends At'
              type='date'
              value={form.trialEndsAt}
              onChange={(event) => updateField('trialEndsAt', event.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
          ) : null}

          <TextField
            label='Renews At'
            type='date'
            value={form.renewsAt}
            onChange={(event) => updateField('renewsAt', event.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />

          <TextField
            label='Shared With (people)'
            type='number'
            value={form.sharedWith}
            onChange={(event) => updateField('sharedWith', event.target.value)}
            inputProps={{ min: 1 }}
            required
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type='submit' form='add-sub-form' variant='contained' disabled={submitting || !canSubmit}>
          {submitting ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSubModal
