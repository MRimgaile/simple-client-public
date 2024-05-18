import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import Title from '../../dashboard/Title';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import axios from 'axios';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { ScoreAvatar } from '../../core/scoreAvatar';
import { useAuth } from '../../../contexts/AuthContext';

export const EvaluationSummary = () => {
  const { evaluationId } = useParams();
  const [dataTypesSummary, setDataTypesSummary] = useState([]);
  const [qualityCriteriaSummary, setQualityCriteriaSummary] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (evaluationId) {
      if (currentUser != null) {
        const idToken = currentUser.getIdToken(true);
        idToken.then((res) => {
          const endpoints = [
            `/api/evaluation/summary/data-types?evaluationId=${evaluationId}`,
            `/api/evaluation/summary/quality-criteria?evaluationId=${evaluationId}`,
          ];
          const requests = endpoints.map((url) => axios.get(url));
          axios
            .all(requests)
            .then((response) => {
              const dataTypesResponse = response[0].data;
              const qualityCriteriaResponse = response[1].data;
              setDataTypesSummary(dataTypesResponse);
              setQualityCriteriaSummary(qualityCriteriaResponse);
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

  const next = () => navigate(`/${evaluationId}/actions`);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={6}>
        <Paper sx={{ p: 2 }}>
          <Title>Data types summary</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Priority</TableCell>
                <TableCell>Data type</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTypesSummary.map((dataType, idx) => (
                <TableRow key={dataType.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{dataType.name}</TableCell>
                  <TableCell>
                    <ScoreAvatar score={dataType.calculatedScore} max={5} isText />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper sx={{ p: 2 }}>
          <Title>Quality criteria summary</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Criteria</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qualityCriteriaSummary.map((criteria) => (
                <TableRow key={criteria.id}>
                  <TableCell>{criteria.name}</TableCell>
                  <TableCell>
                    <ScoreAvatar score={criteria.calculatedScore} max={5} isText />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <br />
        <Stack direction="row" justifyContent="end">
          <Button variant="contained" onClick={next}>
            Next
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};
