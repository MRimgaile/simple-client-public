import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import Title from '../../dashboard/Title';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Table from '@mui/material/Table';
import axios from 'axios';
import { Autocomplete, Avatar, AvatarGroup, Checkbox, Stack, TextField } from '@mui/material';
import SimplePopper from '../../core/simplePopper';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { stringAvatar } from '../../../helpers';
import { useAuth } from '../../../contexts/AuthContext';

export const EvaluationStakeholders = () => {
  const { evaluationId } = useParams();
  const [evaluationPeriodId, setEvaluationPeriodId] = useState();
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!evaluationPeriodId) {
      if (currentUser != null) {
        const idToken = currentUser.getIdToken(true);
        idToken.then((res) => {
          axios
            .get(`/api/evaluation-period?evaluationId=${evaluationId}`)
            .then((response) => {
              if (response.status === 200 && response.data && response.data.length > 0) {
                setEvaluationPeriodId(response.data[0].evaluationPeriodId);
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
  }, [currentUser, evaluationId, evaluationPeriodId, navigate]);

  useEffect(() => {
    if (evaluationPeriodId) {
      if (currentUser != null) {
        const idToken = currentUser.getIdToken(true);
        idToken.then((res) => {
          const endpoints = [
            '/api/stakeholders',
            `/api/evaluation/stakeholders?evaluationPeriodId=${evaluationPeriodId}`,
          ];
          const requests = endpoints.map((url) => axios.get(url));
          axios
            .all(requests)
            .then((response) => {
              const stakeholdersResponse = response[0].data;
              const selectedStakeholdersResponse = response[1].data;
              const selectedSh = stakeholdersResponse
                .filter((stakeholder) =>
                  stakeholder.users.filter((user) => selectedStakeholdersResponse.includes(user.id))
                )
                .map((stakeholder) => stakeholder.id);
              setSelected(selectedSh);
              setStakeholders(stakeholdersResponse);
              setSelectedUsers(selectedStakeholdersResponse);
              if (selectedStakeholdersResponse.length === 1 && selectedStakeholdersResponse[0] === 1) {
                setDisabled(true);
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
  }, [currentUser, evaluationPeriodId, navigate]);

  const next = (evalId) => navigate(`/${evaluationId || evalId}/processes`);

  const postStakeholders = () => {
    axios
      .post('/api/evaluation/stakeholders', {
        evaluationPeriodId,
        users: selectedUsers,
      })
      .then((response) => {
        next(response.evaluationId);
      });
  };

  const getSelectedStakeholderUsers = (users) => {
    const foundUsers = users.filter((user) => selectedUsers.indexOf(user.id) > -1);
    if (foundUsers.length > 0) {
      return foundUsers.map((user) => <Avatar {...stringAvatar(user)} />);
    }
    return (
      <Avatar sx={{ width: 24, height: 24 }}>
        <PersonAddAltIcon sx={{ fontSize: 16 }} />
      </Avatar>
    );
  };

  const toggleUser = (userId) => {
    const sel = [...selectedUsers];
    if (sel.indexOf(userId) < 0) {
      setSelectedUsers([...sel, userId]);
    } else {
      setSelectedUsers(sel.filter((usr) => usr !== userId));
    }
  };

  const removeSelected = (selectedId) => {
    const stakeholder = stakeholders.find((sh) => sh.id === selectedId);
    const newSelected = [...selected.filter((selId) => selId !== selectedId)];
    const usersToRemove = stakeholder.users.map((user) => user.id);
    const newSelectedUsers = [...selectedUsers.filter((selectedUser) => usersToRemove.indexOf(selectedUser) < 0)];
    setSelected(newSelected);
    setSelectedUsers(newSelectedUsers);
  };

  return (
    <Grid container spacing={3}>
      {/* Wat */}
      <Grid item xs={12} md={7} lg={7}>
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Title>Stakeholders</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colspan={3}>Stakeholders</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selected.map((id) => {
                const department = stakeholders.find((sh) => sh.id === id);
                return (
                  <TableRow key={department.id}>
                    <TableCell>{department.name}</TableCell>
                    <TableCell align="right">
                      <SimplePopper
                        trigger={<AvatarGroup>{getSelectedStakeholderUsers(department.users)}</AvatarGroup>}
                        content={
                          <List>
                            {department.users.map((user) => (
                              <ListItemButton role={undefined} onClick={() => !disabled && toggleUser(user.id)} dense>
                                <ListItemIcon>
                                  <Checkbox
                                    disabled={disabled}
                                    edge="start"
                                    checked={selectedUsers.indexOf(user.id) > -1}
                                    tabIndex={-1}
                                    disableRipple
                                  />
                                </ListItemIcon>
                                <ListItemText id={user.id} primary={`${user.firstName} ${user.lastName}`} />
                              </ListItemButton>
                            ))}
                          </List>
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton disabled={disabled} color="error" onClick={() => removeSelected(department.id)}>
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
            options={stakeholders
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
            getOptionLabel={(option) => (Array.isArray(option) ? '' : option.label)}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Add..." />}
          />
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" onClick={disabled ? next : postStakeholders}>
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
          <img alt="" src="https://simple.duttiv.com/fw/stakeholders.png" />
        </Paper>
      </Grid>
    </Grid>
  );
};
