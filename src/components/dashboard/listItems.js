import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import LayersIcon from "@mui/icons-material/Layers";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DatasetIcon from "@mui/icons-material/Dataset";
import DataArrayIcon from "@mui/icons-material/DataArray";
import HardwareIcon from "@mui/icons-material/Hardware";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GradingIcon from "@mui/icons-material/Grading";
import GridViewIcon from "@mui/icons-material/GridView";
import { Link } from "react-router-dom";
import { Collapse } from "@mui/material";
import List from "@mui/material/List";

export const mainListItems = (evaluationId) => (
  <React.Fragment>
    <Link className="plain" to={`/start`}>
      <ListItemButton>
        <ListItemIcon>
          <DatasetIcon />
        </ListItemIcon>
        <ListItemText primary="Evaluation" />
      </ListItemButton>
    </Link>
    <Collapse in timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {evaluationId ? (
          <Link className="plain" to={`/${evaluationId}/stakeholders`}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Stakeholders" />
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ pl: 4 }} disabled>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Stakeholders" />
          </ListItemButton>
        )}
        {evaluationId ? (
          <Link className="plain" to={`/${evaluationId}/processes`}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Processes" />
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ pl: 4 }} disabled>
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Processes" />
          </ListItemButton>
        )}
        {evaluationId ? (
          <Link className="plain" to={`/${evaluationId}/data-types`}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <DataArrayIcon />
              </ListItemIcon>
              <ListItemText primary="Data types" />
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ pl: 4 }} disabled>
            <ListItemIcon>
              <DataArrayIcon />
            </ListItemIcon>
            <ListItemText primary="Data types" />
          </ListItemButton>
        )}
        {evaluationId ? (
          <Link className="plain" to={`/${evaluationId}/tools`}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <HardwareIcon />
              </ListItemIcon>
              <ListItemText primary="Tools" />
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ pl: 4 }} disabled>
            <ListItemIcon>
              <HardwareIcon />
            </ListItemIcon>
            <ListItemText primary="Tools" />
          </ListItemButton>
        )}
        {evaluationId ? (
          <Link className="plain" to={`/${evaluationId}/assessment`}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Assessment" />
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ pl: 4 }} disabled>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Assessment" />
          </ListItemButton>
        )}
        {evaluationId ? (
          <Link className="plain" to={`/${evaluationId}/results`}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <GridViewIcon />
              </ListItemIcon>
              <ListItemText primary="Results" />
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ pl: 4 }} disabled>
            <ListItemIcon>
              <GridViewIcon />
            </ListItemIcon>
            <ListItemText primary="Results" />
          </ListItemButton>
        )}
        {evaluationId ? (
          <Link className="plain" to={`/${evaluationId}/summary`}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <GradingIcon />
              </ListItemIcon>
              <ListItemText primary="Summary" />
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ pl: 4 }} disabled>
            <ListItemIcon>
              <GradingIcon />
            </ListItemIcon>
            <ListItemText primary="Summary" />
          </ListItemButton>
        )}
        {evaluationId ? (
          <Link className="plain" to={`/${evaluationId}/actions`}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ChecklistRtlIcon />
              </ListItemIcon>
              <ListItemText primary="Actions" />
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ pl: 4 }} disabled>
            <ListItemIcon>
              <ChecklistRtlIcon />
            </ListItemIcon>
            <ListItemText primary="Actions" />
          </ListItemButton>
        )}
      </List>
    </Collapse>
  </React.Fragment>
);
