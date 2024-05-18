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
import axios from 'axios';
import { Autocomplete, Stack, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export const EvaluationProcesses = () => {
  const { evaluationId } = useParams();
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [added, setAdded] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (evaluationId) {
      if (currentUser != null) {
        const idToken = currentUser.getIdToken(true);
        idToken.then((res) => {
          const endpoints = ['/api/processes', `/api/evaluation/processes?evaluationId=${evaluationId}`];
          const requests = endpoints.map((url) => axios.get(url));
          axios
            .all(requests)
            .then((response) => {
              const processesResponse = response[0].data;
              const selectedProcessesResponse = response[1].data;
              setProcesses(processesResponse);
              setSelected(selectedProcessesResponse.map((process) => process.id));
              if (selectedProcessesResponse.length === 0) {
                setDisabled(false);
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 403) {
                navigate('/start');
              }
            });
        });
      }
    }
  }, [currentUser, evaluationId, navigate]);

  const next = () => navigate(`/${evaluationId}/data-types`);

  const postProcesses = () => {
    const newProcesses = added.filter((newProcess) => selected.indexOf(newProcess.id) > -1);
    console.log(newProcesses);
    axios
      .post('/api/evaluation/processes', {
        evaluationId,
        processes: selected.filter((id) => !isNaN(id)),
        newProcesses,
      })
      .then((response) => {
        next();
      });
  };

  const removeSelected = (selectedId) => {
    const newSelected = [...selected.filter((selId) => selId !== selectedId)];
    setSelected(newSelected);
  };

  const combinedProcesses = [...processes, ...added];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7} lg={7}>
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
                const process = combinedProcesses.find((sh) => sh.id === id);
                return (
                  <TableRow key={process.id}>
                    <TableCell>{process.name}</TableCell>
                    <TableCell align="right">
                      <IconButton disabled={disabled} color="error" onClick={() => removeSelected(process.id)}>
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
            freeSolo
            disabled={disabled}
            value={autoCompleteValue}
            disableClearable
            disablePortal
            name={new Date().getTime()}
            options={combinedProcesses
              .filter((process) => selected.indexOf(process.id) < 0)
              .map((process) => ({
                id: process.id,
                label: process.name,
              }))}
            onChange={(e, value) => {
              if (typeof value === 'string') {
                const newId = `new-${added.length}`;
                setAdded([...added, { id: newId, name: value }]);
                setSelected([...selected, newId]);
              } else {
                setSelected([...selected, value.id]);
              }
              setAutoCompleteValue([]);
            }}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Add..." />}
          />
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" onClick={disabled ? next : postProcesses}>
              Next
            </Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={5} lg={5}>
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
