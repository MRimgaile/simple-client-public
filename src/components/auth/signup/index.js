import React, { useState, useEffect } from 'react';
import { Card, TextField, Button, Box, Container, Select, MenuItem, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

export const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { login } = useAuth();
  const { getToken } = useAuth();
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(null);

  useEffect(() => {
    if (isSignUp) {
      axios
        .get('/api/timezones')
        .then((response) => setTimezones(response.data))
        .catch((error) => console.error('Error fetching timezones:', error));
    }
  }, [isSignUp]);

  const isEmailValid = () => {
    let emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const signIn = (e) => {
    e.preventDefault();
    login(email, password)
      .then(() => {
        navigate('/');
      })
      .catch((error) => alert(error.message));
  };

  const signUp = async (e) => {
    e.preventDefault();
    signup(email, password).then(() => {
      const idToken = getToken();
      axios
        .post(
          '/api/userTimezone',
          {
            timezoneId: selectedTimezone,
          },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        )
        .then(() => navigate('/'))
        .catch((error) => alert(error.message));
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (e.target.value.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  const switchToSignUp = () => {
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setPasswordError('');
    setIsSignUp(true);
  };

  const switchToLogin = () => {
    setEmail('');
    setPassword('');
    setPasswordError('');
    setIsSignUp(false);
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
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
          error={!isEmailValid() && email.length > 0}
          helperText={!isEmailValid() && email.length > 0 ? 'Invalid email address' : null}
          inputProps={{ 'data-testid': 'usernameInput' }}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          variant="outlined"
          margin="normal"
          fullWidth
          error={passwordError}
          helperText={passwordError ? 'Password should be at least 6 characters' : null}
          inputProps={{ 'data-testid': 'passwordInput' }}
        />

        {isSignUp && (
          <>
            <TextField
              label="Confirm Password"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              error={passwordConfirm && password !== passwordConfirm}
              helperText={passwordConfirm && password !== passwordConfirm ? 'Passwords do not match' : null}
            />

            {timezones.length > 0 ? (
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
            ) : (
              <p>Loading timezones...</p>
            )}
          </>
        )}

        {isSignUp ? (
          <div>
            <Box mt={2}>
              <Button
                type="submit"
                disabled={
                  !isEmailValid() ||
                  !password ||
                  !passwordConfirm ||
                  password !== passwordConfirm ||
                  passwordError ||
                  !selectedTimezone
                }
                onClick={signUp}
                variant="contained"
              >
                Sign Up
              </Button>
            </Box>
            <Box mt={2}>
              <Button onClick={switchToLogin} variant="text">
                Back to Login
              </Button>
            </Box>
          </div>
        ) : (
          <div>
            <Box mt={2}>
              <Button type="submit" onClick={signIn} variant="contained" data-testid="loginButton">
                Sign In
              </Button>
            </Box>
            <Box mt={2}>
              <Button onClick={switchToSignUp} variant="text">
                Sign Up
              </Button>
            </Box>
          </div>
        )}
      </Card>
    </Container>
  );
};
