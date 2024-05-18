import './App.css';
import Dashboard from './components/dashboard/Dashboard';
import EvaluationItems from './components/dashboard/EvaluationItems';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Users } from './components/configuration/users';
import { Processes } from './components/configuration/processes';
import { EvaluationStakeholders } from './components/evaluation/stakeholders';
import { EvaluationProcesses } from './components/evaluation/processes';
import { DataTypes } from './components/evaluation/dataTypes';
import { EvaluationTools } from './components/evaluation/tools';
import { Assessment } from './components/evaluation/assessment';
import { EvaluationResults } from './components/evaluation/results';
import { EvaluationSummary } from './components/evaluation/summary';
import { EvaluationActions } from './components/evaluation/actions';
import { Login } from './components/auth/signup/';
import Logout from './components/auth/logout';
import { UpdateUserSettings } from './components/auth/update';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <div className="App">
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route
              path="/update-user-details"
              element={
                <PrivateRoute>
                  <UpdateUserSettings />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="start"
              element={
                <PrivateRoute>
                  <EvaluationItems />
                </PrivateRoute>
              }
            />
          </Route>
          <Route
            path="/:evaluationId"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route
              path="stakeholders"
              element={
                <PrivateRoute>
                  <EvaluationStakeholders />
                </PrivateRoute>
              }
            />
            <Route
              path="processes"
              element={
                <PrivateRoute>
                  <EvaluationProcesses />
                </PrivateRoute>
              }
            />
            <Route
              path="data-types"
              element={
                <PrivateRoute>
                  <DataTypes />
                </PrivateRoute>
              }
            />
            <Route
              path="tools"
              element={
                <PrivateRoute>
                  <EvaluationTools />
                </PrivateRoute>
              }
            />
            <Route
              path="assessment"
              element={
                <PrivateRoute>
                  <Assessment />
                </PrivateRoute>
              }
            />
            <Route
              path="results"
              element={
                <PrivateRoute>
                  <EvaluationResults />
                </PrivateRoute>
              }
            />
            <Route
              path="summary"
              element={
                <PrivateRoute>
                  <EvaluationSummary />
                </PrivateRoute>
              }
            />
            <Route
              path="actions"
              element={
                <PrivateRoute>
                  <EvaluationActions />
                </PrivateRoute>
              }
            />
          </Route>
          <Route
            path="configuration"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route
              path="users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="processes"
              element={
                <PrivateRoute>
                  <Processes />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </AuthProvider>
    </Router>
  </div>
);
export default App;
