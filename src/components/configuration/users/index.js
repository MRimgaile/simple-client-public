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
import { Autocomplete, Avatar, AvatarGroup, Checkbox, Stack, TextField } from '@mui/material';
import SimplePopper from '../../core/simplePopper';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { stringToColor } from '../../../helpers';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

const stringAvatar = (user) => {
  const name = `${user.firstName} ${user.lastName}`;
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 24,
      height: 24,
      fontSize: '11px',
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
};

export const Users = () => {
  const [autoCompleteValue, setAutoCompleteValue] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser != null) {
      const idToken = currentUser.getIdToken(true);
      idToken.then((res) => {
        axios
          .get('/api/stakeholders')
          .then((response) => {
            if (response.status === 200) {
              setStakeholders(response.data);
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

  const postStakeholders = () => {
    axios
      .post('/api/users', {
        users: selectedUsers,
      })
      .then((response) => {
        navigate('/processes');
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
      <Grid item xs={12} md={8} lg={8}>
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
                              <ListItemButton role={undefined} onClick={() => toggleUser(user.id)} dense>
                                <ListItemIcon>
                                  <Checkbox
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
                      <IconButton color="error" onClick={() => removeSelected(department.id)}>
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
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Add..." />}
          />
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" onClick={postStakeholders}>
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
          <img alt="" src="https://simple.duttiv.com/fw/stakeholders.png" />
        </Paper>
      </Grid>
    </Grid>
  );
};
