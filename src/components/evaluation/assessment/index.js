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
import { FormControl, MenuItem, Select, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { calculateTotalCriteria, calculateTotalDataTypes } from '../../../helpers';
import { ScoreAvatar } from '../../core/scoreAvatar';
import { useAuth } from '../../../contexts/AuthContext';

export const Assessment = () => {
  const { evaluationId } = useParams();
  const [evaluationDataTypes, setEvaluationDataTypes] = useState([]);
  const [qualityCriteria, setQualityCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [disabled, setDisabled] = useState(true);
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
            `/api/evaluation/scores?evaluationId=${evaluationId}`,
          ];
          const requests = endpoints.map((url) => axios.get(url));
          axios
            .all(requests)
            .then((response) => {
              const qualityCriteriaResponse = response[0].data;
              const dataTypesResponse = response[1].data;
              const scoresResponse = response[2].data;
              setQualityCriteria(qualityCriteriaResponse);
              setEvaluationDataTypes(dataTypesResponse);
              if (scoresResponse && Object.keys(scoresResponse).length > 0) {
                setScores(scoresResponse);
              } else {
                const initialScores = {};
                qualityCriteriaResponse.forEach((quality) => {
                  const qualityScore = {};
                  dataTypesResponse.forEach((dt) => {
                    qualityScore[dt.id] = 0;
                  });
                  initialScores[quality.id] = qualityScore;
                });
                setScores(initialScores);
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

  const next = () => navigate(`/${evaluationId}/results`);

  const setScore = (qualityId, dataTypeId, score) => {
    const scoreInt = parseInt(score, 10);
    const newScores = { ...scores };
    let finalScore = scoreInt;
    if (isNaN(scoreInt) || scoreInt < 0) {
      finalScore = 0;
    } else if (scoreInt > 5) {
      finalScore = 5;
    }
    newScores[qualityId][dataTypeId] = finalScore;
    setScores(newScores);
  };

  const postScores = () => {
    const data = {
      evaluationId,
      scores,
    };
    axios.post('/api/evaluation/scores', data).then(next);
  };

  const dataTypeTotal = calculateTotalDataTypes(scores);
  const criteriaTotal = calculateTotalCriteria(scores);
  const maxDataTypeScore = qualityCriteria.length * 5;
  const maxCriteriaScore = evaluationDataTypes.length * 5;

  const scoreOptions = [
    {
      value: 5,
      label: 'excellent',
    },
    {
      value: 4,
      label: 'good',
    },
    {
      value: 3,
      label: 'average',
    },
    {
      value: 2,
      label: 'fair',
    },
    {
      value: 1,
      label: 'poor',
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper sx={{ p: 2 }}>
          <Title>Data types</Title>
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
                  {evaluationDataTypes.map((dataType) => (
                    <TableCell align="center">
                      <FormControl fullWidth>
                        <Select
                          disabled={disabled}
                          id={`score-${quality.name}-${dataType.name}`}
                          labelId={`label-${quality.name}-${dataType.name}`}
                          value={scores[quality.id][dataType.id]}
                          onChange={(e) => e.target && setScore(quality.id, dataType.id, e.target.value)}
                        >
                          {scoreOptions.map((scoreOption) => (
                            <MenuItem value={scoreOption.value}>{scoreOption.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
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
                  <ScoreAvatar score={dataTypeTotal.sum} max={maxDataTypeScore * maxCriteriaScore} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <br />
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" onClick={disabled ? next : postScores}>
              Next
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};
