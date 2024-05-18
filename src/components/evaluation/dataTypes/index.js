import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import React, { Fragment, useEffect, useState } from 'react';
import Title from '../../dashboard/Title';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import axios from 'axios';
import { Checkbox, Chip, Stack } from '@mui/material';
import SimplePopper from '../../core/simplePopper';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { stringToColor } from '../../../helpers';
import { useAuth } from '../../../contexts/AuthContext';

const calculateCount = (selected, dataTypes) => {
  const result = [];
  dataTypes.forEach((dataType) => {
    const count = Object.values(selected).filter((selectedDataTypes) => selectedDataTypes.includes(dataType.id)).length;
    if (count > 0) {
      result.push({ name: dataType.name, count });
    }
  });
  return result.sort((o1, o2) => o2.count - o1.count);
};

export const DataTypes = () => {
  const { evaluationId } = useParams();
  const [evaluationProcesses, setEvaluationProcesses] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [selected, setSelected] = useState({});
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (evaluationId) {
      if (currentUser != null) {
        const idToken = currentUser.getIdToken(true);
        idToken.then((res) => {
          const endpoints = [
            '/api/data-types',
            `/api/processes`,
            `/api/evaluation/processes?evaluationId=${evaluationId}`,
            `/api/evaluation/data-types?evaluationId=${evaluationId}`,
          ];
          const requests = endpoints.map((url) => axios.get(url));
          axios
            .all(requests)
            .then((response) => {
              const dataTypesResponse = response[0].data;
              const processesResponse = response[1].data;
              const evaluationProcessesResponse = response[2].data;
              const evaluationDataTypesResponse = response[3].data;
              setDataTypes(dataTypesResponse);
              setEvaluationProcesses(evaluationProcessesResponse);
              const initialSelected = {};
              processesResponse.forEach((process) => {
                initialSelected[process.id] =
                  evaluationDataTypesResponse &&
                  evaluationDataTypesResponse
                    .filter((edtr) => edtr.processId === process.id)
                    .map((edtr) => edtr.dataTypeId);
              });
              setSelected(initialSelected);
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

  const next = () => navigate(`/${evaluationId}/tools`);

  const postDataTypes = () => {
    const data = [];
    Object.keys(selected).forEach((processIdString) => {
      const dataTypes = selected[processIdString];
      if (dataTypes.length > 0) {
        const processId = parseInt(processIdString, 10);
        const { evaluationProcessId } = evaluationProcesses.find((ep) => ep.id === processId);
        dataTypes.forEach((dataTypeId) => data.push({ evaluationProcessId, dataTypeId }));
      }
    });
    axios.post('/api/evaluation/data-types', { data }).then(next);
  };

  const toggleDataType = (processId, dataTypeId) => {
    const newSelected = { ...selected };
    if (!newSelected[processId]) {
      newSelected[processId] = [];
    }
    const newDataTypes = [...newSelected[processId]];
    if (newDataTypes.indexOf(dataTypeId) < 0) {
      newSelected[processId] = [...newDataTypes, dataTypeId];
    } else {
      newSelected[processId] = newDataTypes.filter((dtId) => dtId !== dataTypeId);
    }
    setSelected(newSelected);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={8}>
        <Paper sx={{ p: 2 }}>
          <Title>Data types</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Process</TableCell>
                <TableCell>Data types</TableCell>
                <TableCell align="right">&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluationProcesses.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>{process.name}</TableCell>
                  <TableCell>
                    {selected[process.id] &&
                      // eslint-disable-next-line array-callback-return
                      selected[process.id].map((dataTypeId) => {
                        const dataType = dataTypes.find((dataType) => dataType.id === dataTypeId);
                        if (dataType) {
                          return (
                            <Fragment>
                              <Chip
                                sx={{
                                  marginBottom: '4px',
                                  backgroundColor: `${stringToColor(dataType.name)}60`,
                                }}
                                label={dataType.name}
                                size="small"
                              />
                              <br />
                            </Fragment>
                          );
                        }
                      })}
                  </TableCell>
                  <TableCell align="right">
                    <SimplePopper
                      trigger={<Chip size="small" label="Select" />}
                      content={
                        <List>
                          {dataTypes.map((dataType) => (
                            <ListItemButton
                              role={undefined}
                              onClick={() => toggleDataType(process.id, dataType.id)}
                              dense
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={selected[process.id] && selected[process.id].includes(dataType.id)}
                                  tabIndex={-1}
                                  disableRipple
                                />
                              </ListItemIcon>
                              <ListItemText id={dataType.id} primary={dataType.name} />
                            </ListItemButton>
                          ))}
                        </List>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" onClick={postDataTypes}>
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
          <Title>Data prioritization</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data type</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calculateCount(selected, dataTypes).map((dataType) => (
                <TableRow key={dataType.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {dataType.name}
                  </TableCell>
                  <TableCell align="right">{dataType.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};
