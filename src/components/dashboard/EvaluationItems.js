import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NewEvaluation from "./NewEvaluation";

function EvaluationItems() {
  const [evaluations, setEvaluations] = useState([]);
  const navigate = useNavigate();
  const select = (evaluationId) => navigate(`/${evaluationId}/stakeholders`);

  useEffect(() => {
    const endpoints = ["/api/evaluations", "/api/users"];
    const requests = endpoints.map((url) => axios.get(url));
    axios.all(requests).then((response) => {
      const evaluationsResponse = response[0].data;
      const usersResponse = response[1].data;
      const userIdToName = {};
      usersResponse.forEach((user) => {
        userIdToName[user.id] = `${user.firstName} ${user.lastName}`;
      });
      const updatedEvaluations = evaluationsResponse.map((evaluation) => {
        return {
          ...evaluation,
          user: userIdToName[evaluation.user],
        };
      });

      setEvaluations(updatedEvaluations);
    });
  }, []);

  return (
    <>
      <div>
        <div class="element-container">
          <NewEvaluation />
        </div>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, paddingTop: 20 }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Evaluation name</TableCell>
                <TableCell align="right">Id</TableCell>
                <TableCell align="right">User</TableCell>
                <TableCell align="right">Time Created</TableCell>
                <TableCell align="right">Is completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow
                  key={evaluation.evalName}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "lightgray",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => select(evaluation.id)}
                >
                  <TableCell component="th" scope="row">
                    {evaluation.evalName}
                  </TableCell>
                  <TableCell align="right">{evaluation.id}</TableCell>
                  <TableCell align="right">{evaluation.user}</TableCell>
                  <TableCell align="right">{evaluation.createdTime}</TableCell>
                  <TableCell align="right">
                    {evaluation.completed === 1 ? <CheckCircle /> : <Cancel />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default EvaluationItems;
