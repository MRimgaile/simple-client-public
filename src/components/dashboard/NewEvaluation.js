import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

function NewEvaluation() {
  const [showForm, setShowForm] = useState(false);
  const [evalName, setEvalName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const select = (evaluationId) => navigate(`/${evaluationId}/stakeholders`);

  useEffect(() => {
    if (currentUser != null) {
      const idToken = currentUser.getIdToken(true);
      idToken.then((res) => {
        axios.get('/api/users').then((response) => {
          if (response.status === 200 && response.data && response.data.length > 0) {
            setUsers(response.data);
          }
        });
      });
    }
  }, [currentUser]);

  const startNewEvaluation = () => {
    setErrorMessage('');
    setShowForm(true);
  };

  const cancelNewEvaluation = () => {
    setShowForm(false);
    setEvalName('');
    setSelectedUserId('');
  };

  const saveNewEvaluation = () => {
    axios
      .post('/api/evaluation', {
        userId: selectedUserId,
        evalName: evalName,
      })
      .then((response) => {
        select(response.data.evaluationId);
      })
      .catch((error) => {
        setErrorMessage('An error occurred while creating the evaluation.');
      });

    cancelNewEvaluation();
  };

  if (showForm) {
    return (
      <>
        <div>
          <TextField label="Evaluation name" value={evalName} onChange={(e) => setEvalName(e.target.value)} />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="user-label">Assigned user</InputLabel>
            <Select
              labelId="user-label"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              label="Assigned user"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {`${user.firstName} ${user.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="element-container">
          <Button onClick={cancelNewEvaluation}>Cancel</Button>
          <Button onClick={saveNewEvaluation} disabled={!evalName || !selectedUserId}>
            Continue
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="element-container">{errorMessage && <Alert severity="error">{errorMessage}</Alert>}</div>
      <Button variant="outlined" data-testid="startNewEvaluation" onClick={startNewEvaluation}>
        Start new evaluation
      </Button>
    </>
  );
}

export default NewEvaluation;
