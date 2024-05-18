import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Cancel, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NewEvaluation from './NewEvaluation';
import { useAuth } from '../../contexts/AuthContext';

function EvaluationItems() {
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const select = (evaluationId) => navigate(`/${evaluationId}/stakeholders`);

  function offsetToMilliseconds(offset) {
    const time = offset.split(':');
    return +time[0] * 60 * 60 * 1000 + +time[1] * 60 * 1000;
  }

  function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);

    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  useEffect(() => {
    if (currentUser != null) {
      const idToken = currentUser.getIdToken(true);
      idToken.then((res) => {
        const endpoints = ['/api/evaluations', '/api/users', '/api/userTimezone'];
        const requests = endpoints.map((url) => axios.get(url));
        axios
          .all(requests)
          .then((response) => {
            const evaluationsResponse = response[0].data;
            const usersResponse = response[1].data;
            const userTimezoneOffset = offsetToMilliseconds(response[2].data[0].offsetFromUTC);
            const userIdToName = {};
            usersResponse.forEach((user) => {
              userIdToName[user.id] = `${user.firstName} ${user.lastName}`;
            });
            const updatedEvaluations = evaluationsResponse.map((evaluation) => {
              const adjustedEndTime = evaluation.endTime
                ? new Date(new Date(evaluation.endTime).getTime() - userTimezoneOffset)
                : null;
              return {
                ...evaluation,
                user: userIdToName[evaluation.user],
                endTime: formatDateTime(adjustedEndTime),
              };
            });
            setEvaluations(updatedEvaluations);
            setIsLoading(false);
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              navigate('/start');
            }
          });
      });
    }
  }, [currentUser, navigate]);

  return (
    <>
      <div>
        <div className="element-container">
          <NewEvaluation />
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, paddingTop: 20 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Evaluation name</TableCell>
                <TableCell align="right">Id</TableCell>
                <TableCell align="right">Owner</TableCell>
                <TableCell align="right">Time Created</TableCell>
                <TableCell align="right">Time Finished</TableCell>
                <TableCell align="right">Is completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                evaluations.map((evaluation) => (
                  <TableRow
                    key={evaluation.evalName}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': {
                        backgroundColor: 'lightgray',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => select(evaluation.id)}
                  >
                    <TableCell component="th" scope="row">
                      {evaluation.evalName}
                    </TableCell>
                    <TableCell align="right">{evaluation.id}</TableCell>
                    <TableCell align="right">{evaluation.user}</TableCell>
                    <TableCell align="right">{formatDateTime(evaluation.createdTime)}</TableCell>
                    <TableCell align="right">{evaluation.endTime}</TableCell>
                    <TableCell align="right">{evaluation.completed === 1 ? <CheckCircle /> : <Cancel />}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default EvaluationItems;
