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
import { calculateTotalCriteria, calculateTotalDataTypes } from '../../../helpers';
import { ScoreAvatar } from '../../core/scoreAvatar';
import { useAuth } from '../../../contexts/AuthContext';

export const EvaluationResults = () => {
  const { evaluationId } = useParams();
  const [evaluationDataTypes, setEvaluationDataTypes] = useState([]);
  const [qualityCriteria, setQualityCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [totalEvaluations, setTotalEvaluations] = useState(1);
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (evaluationId) {
      if (currentUser != null) {
        const idToken = currentUser.getIdToken(true);
        idToken.then((res) => {
          const endpoints = [
            `/api/quality-criteria`,
            `/api/evaluation/scores/data-types?evaluationId=${evaluationId}`,
            `/api/evaluation/results?evaluationId=${evaluationId}`,
            `/api/evaluation/total-evaluations?evaluationId=${evaluationId}`,
          ];
          const requests = endpoints.map((url) => axios.get(url));
          axios
            .all(requests)
            .then((response) => {
              const qualityCriteriaResponse = response[0].data;
              const dataTypesResponse = response[1].data;
              const resultsResponse = response[2].data;
              const totalEvaluationsResponse = response[3].data;
              setQualityCriteria(qualityCriteriaResponse);
              setEvaluationDataTypes(dataTypesResponse);
              if (resultsResponse && Object.keys(resultsResponse).length > 0) {
                setScores(resultsResponse);
              }
              if (totalEvaluationsResponse.total > 0) setTotalEvaluations(totalEvaluationsResponse.total);
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

  const next = () => navigate(`/${evaluationId}/summary`);

  const dataTypeTotal = calculateTotalDataTypes(scores);
  const criteriaTotal = calculateTotalCriteria(scores);
  const maxDataTypeScore = qualityCriteria.length * 5 * totalEvaluations;
  const maxCriteriaScore = evaluationDataTypes.length * 5 * totalEvaluations;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper sx={{ p: 2 }}>
          <Title>Results</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Criteria / data type</TableCell>
                {evaluationDataTypes.map((dataType) => (
                  <TableCell align="center">{dataType.name}</TableCell>
                ))}
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qualityCriteria.map((quality) => (
                <TableRow key={quality.id}>
                  <TableCell>{quality.name}</TableCell>
                  {scores &&
                    Object.keys(scores).length > 0 &&
                    evaluationDataTypes.map((dataType) => (
                      <TableCell align="center">{scores[quality.id][dataType.id]}</TableCell>
                    ))}
                  <TableCell align="right">
                    <ScoreAvatar score={criteriaTotal[quality.id]} max={maxCriteriaScore} />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                {evaluationDataTypes.map((dataType) => (
                  <TableCell align="center">
                    <ScoreAvatar score={dataTypeTotal[dataType.id]} max={maxDataTypeScore} />
                  </TableCell>
                ))}
                <TableCell>
                  {/*                  <ScoreAvatar
                    score={dataTypeTotal.sum}
                    max={maxDataTypeScore * maxCriteriaScore}
                  />*/}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <br />
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" onClick={next}>
              Next
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};
