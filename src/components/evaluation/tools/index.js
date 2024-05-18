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

export const EvaluationTools = () => {
  const { evaluationId } = useParams();
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);
  const [tools, setTools] = useState([]);
  const [selected, setSelected] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser != null) {
      const idToken = currentUser.getIdToken(true);
      idToken.then((res) => {
        const endpoints = ['/api/tools', `/api/evaluation/tools?evaluationId=${evaluationId}`];
        const requests = endpoints.map((url) => axios.get(url));
        axios
          .all(requests)
          .then((response) => {
            const toolsResponse = response[0].data;
            const selectedToolsResponse = response[1].data;
            setTools(toolsResponse);
            setSelected(selectedToolsResponse.map((tool) => tool.id));
            if (selectedToolsResponse.length === 0) {
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
  }, [currentUser, evaluationId, navigate]);

  const next = () => navigate(`/${evaluationId}/assessment`);

  const postTools = () => {
    axios
      .post('/api/evaluation/tools', {
        evaluationId,
        tools: selected,
      })
      .then((response) => {
        next();
      });
  };

  const removeSelected = (selectedId) => {
    const newSelected = [...selected.filter((selId) => selId !== selectedId)];
    setSelected(newSelected);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7} lg={7}>
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Title>Tools</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colspan={3}>Tools</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selected.map((id) => {
                const tool = tools.find((sh) => sh.id === id);
                return (
                  <TableRow key={tool.id}>
                    <TableCell>{tool.name}</TableCell>
                    <TableCell align="right">
                      <IconButton disabled={disabled} color="error" onClick={() => removeSelected(tool.id)}>
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
            disabled={disabled}
            value={autoCompleteValue}
            disableClearable
            disablePortal
            options={tools
              .filter((tool) => selected.indexOf(tool.id) < 0)
              .map((tool) => ({
                id: tool.id,
                label: tool.name,
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
            <Button variant="contained" onClick={disabled ? next : postTools} disabled={selected.length === 0}>
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
          <img alt="" src="https://simple.duttiv.com/fw/tools.png" />
        </Paper>
      </Grid>
    </Grid>
  );
};
