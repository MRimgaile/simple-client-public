import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import EvaluationItems from "./components/dashboard/EvaluationItems";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Users } from "./components/configuration/users";
import { Processes } from "./components/configuration/processes";
import { EvaluationStakeholders } from "./components/evaluation/stakeholders";
import { EvaluationProcesses } from "./components/evaluation/processes";
import { DataTypes } from "./components/evaluation/dataTypes";
import { EvaluationTools } from "./components/evaluation/tools";
import { Assessment } from "./components/evaluation/assessment";
import { EvaluationResults } from "./components/evaluation/results";
import { EvaluationSummary } from "./components/evaluation/summary";
import { EvaluationActions } from "./components/evaluation/actions";

const App = () => (
  <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="start" element={<EvaluationItems />} />
        </Route>
        <Route path="/:evaluationId" element={<Dashboard />}>
          <Route path="stakeholders" element={<EvaluationStakeholders />} />
          <Route path="processes" element={<EvaluationProcesses />} />
          <Route path="data-types" element={<DataTypes />} />
          <Route path="tools" element={<EvaluationTools />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="results" element={<EvaluationResults />} />
          <Route path="summary" element={<EvaluationSummary />} />
          <Route path="actions" element={<EvaluationActions />} />
        </Route>
        <Route path="configuration" element={<Dashboard />}>
          <Route path="users" element={<Users />} />
          <Route path="processes" element={<Processes />} />
        </Route>
      </Routes>
    </Router>
  </div>
);
export default App;
