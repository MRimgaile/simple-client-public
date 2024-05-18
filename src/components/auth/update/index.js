import React, { useState, useEffect } from 'react';
import { Card, TextField, Button, Box, Container, Select, InputLabel, MenuItem, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

export const UpdateUserSettings = () => {
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const { currentUser } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    axios
      .get('/api/timezones')
      .then((response) => {
        setTimezones(response.data);
        return axios.get('/api/userTimezone');
      })
      .then((response) => {
        setSelectedTimezone(response.data[0].id);
      })
      .catch((error) => console.error('Error:', error));
  }, []);
  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .post('/api/userTimezone', {
        timezoneId: selectedTimezone,
      })
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error('Error updating timezone:', error);
      });
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h2>Update Timezone</h2>

        <TextField
          label="Email"
          type="email"
          value={currentUser.email}
          variant="outlined"
          margin="normal"
          fullWidth
          disabled
        />

        <TextField
          label="Password"
          type="password"
          value="********"
          variant="outlined"
          margin="normal"
          fullWidth
          disabled
        />

        {timezones.length > 0 && (
          <>
            <InputLabel id="timezone-label">Select your timezone</InputLabel>
            <Select
              labelId="timezone-label"
              value={selectedTimezone}
              onChange={handleTimezoneChange}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              {timezones.map((timezone) => (
                <MenuItem key={timezone.id} value={timezone.id}>
                  {timezone.name} (UTC{timezone.offsetFromUTC})
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        <Box mt={2}>
          <Button type="submit" onClick={handleUpdate} variant="contained" disabled={!selectedTimezone}>
            Update Timezone
          </Button>
        </Box>
      </Card>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Timezone updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};
