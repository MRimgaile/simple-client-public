import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import Title from '../../dashboard/Title';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import { Autocomplete, Stack, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

export const Processes = ({ evaluationId }) => {
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [selected, setSelected] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser != null) {
      const idToken = currentUser.getIdToken(true);
      idToken.then((res) => {
        axios
          .get('/api/processes')
          .then((response) => {
            if (response.status === 200) {
              setProcesses(response.data);
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              navigate('/start');
            }
          });
      });
    }
  }, [currentUser, navigate]);

  const postProcesses = () => {
    axios
      .post('/api/processes', {
        evaluationId,
        processes: selected,
      })
      .then((response) => {
        navigate('/data-types');
      });
  };

  const removeSelected = (selectedId) => {
    const newSelected = [...selected.filter((selId) => selId !== selectedId)];
    setSelected(newSelected);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={8}>
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Title>Processes</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colspan={3}>Processes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selected.map((id) => {
                const process = processes.find((sh) => sh.id === id);
                return (
                  <TableRow key={process.id}>
                    <TableCell>{process.name}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => removeSelected(process.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <br />
          <Autocomplete
            value={autoCompleteValue}
            disableClearable
            disablePortal
            options={processes
              .filter((sh) => selected.indexOf(sh.id) < 0)
              .map((department) => ({
                id: department.id,
                label: department.name,
              }))}
            onChange={(e, value) => {
              if (value) {
                setSelected([...selected, value.id]);
                setAutoCompleteValue([]);
              }
            }}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Add..." />}
          />
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" onClick={postProcesses}>
              Next
            </Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <img alt="" src="https://simple.duttiv.com/fw/processes.png" />
        </Paper>
      </Grid>
    </Grid>
  );
};
