import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  makeStyles,
  Label,
  InfoLabel,
  TabList,
  Tab,
  type SelectTabEvent,
  type SelectTabData,
  type TabValue,
  Toaster,
} from "@fluentui/react-components";
import { AddFilled, DeleteRegular, EditRegular } from "@fluentui/react-icons";
import ErrorBar from "../../components/ErrorBar";
import Navbar from "../../components/Navbar";
import { StakeholdersTable } from "../../components/Tables/StakeholdersTable";
import { ResourcesTable } from "../../components/Tables/ResourcesTable";
import { TasksTable } from "../../components/Tables/TasksTable";
import handleError from "../../util/handleError";
import { deleteProject, getProject } from "../../services/projectService";
import { getLoggedInUserId, getUser } from "../../services/userService";
import { getTemplate } from "../../services/templateService";
import {
  advanceRequestExists,
  createAdvanceRequest,
} from "../../services/advanceRequestService";
import type { AdvanceRequestDto } from "../../models/AdvanceRequestDto";
import type { TemplateDto } from "../../models/TemplateDto";
import type { ProjectDto } from "../../models/ProjectDto";
import type { UserDto } from "../../models/UserDto";
import { ApprovalStatus } from "../../models/ApprovalStatus";
import "../Project/Styling/style.css";
import React from "react";
import { useToast } from "../../hooks/ToasterLink";
import { ProjectTasksGantChart } from "../../components/Charts/ProjectTasksGantChart";
import { ProjectResourcesChart } from "../../components/Charts/ProjectResourcesChart";

const useStyles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "50px 20px",
    rowGap: "20px",
  },
  title: {
    fontFamily: "Neuton",
    fontWeight: "700",
    fontStyle: "normal",
    fontSize: "2.5rem",
    paddingBottom: "0.5rem",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    height: "100%",
    width: "100%",
    overflow: "auto",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "0.5rem",
    width: "100%",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    borderRadius: "16px",
  },
  addButton: {
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  editButton: {
    background: "rgba(255, 255, 255, 0.25)",
    color: "rgba(116, 98, 98, 1)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  deleteButton: {
    background: "rgba(255, 255, 255, 0.25)",
    color: "rgba(225, 4, 4, 1)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.5rem",
  },
  label: {
    fontWeight: "700",
  },
  progress: {
    cursor: "default !important",
    fontSize: "1rem",
  },
  button: {
    borderRadius: "16px",
    width: "150px",
  },
  infoLabel: {
    display: "flex",
    alignItems: "center",
    zIndex: 2,
  },
});

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const styles = useStyles();
  const navigate = useNavigate();

  const { notify, toasterId } = useToast();
  const [isRequestMade, setIsRequestMade] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [project, setProject] = useState<ProjectDto>();
  const [template, setTemplate] = useState<TemplateDto>();
  const [owner, setOwner] = useState<UserDto>();
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [error, setError] = useState<string>("");
  const [requestExists, setRequestExists] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState<TabValue>("tab1");

  useEffect(() => {
    if (!id) {
      return;
    }

    Promise.all([getLoggedInUserId(), advanceRequestExists(id)])
      .then(([userId, exists]) => {
        setCurrentUserId(userId);
        setRequestExists(exists);

        return getProject(id);
      })
      .then((rProject) => {
        setProject(rProject);

        return getTemplate(rProject.templateId).then((template) => {
          setTemplate(template);

          return getUser(rProject.ownerId).then((user) => {
            setOwner(user);
            if (
              project?.ownerId == currentUserId ||
              project?.createdBy == currentUserId
            ) {
              setIsEditable(true);
            }
          });
        });
      })
      .catch((error) => handleError(error, setError));
  }, [id]);

  const handleAdvance = () => {
    if (!id || isRequestMade) {
      return;
    }

    const advanceRequest: AdvanceRequestDto = {
      projectId: id,
      currentStageId: project!.currentStage!.id,
      requestedAt: new Date(),
      status: ApprovalStatus[1],
      project: project!,
    };

    createAdvanceRequest(advanceRequest)
      .then(() => {
        setIsRequestMade(true);
      })
      .then(() => notify("", "", "Advance request created", "success"))
      .catch((error) => handleError(error, setError));
  };

  const handleDelete = () => {
    setIsDialogOpen(false);

    if (!id) {
      return;
    }

    deleteProject(id)
      .then(() => navigate("/projects"))
      .catch((error) => handleError(error, setError));
  };

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <Navbar>
      <Toaster toasterId={toasterId} />
      <div className={styles.container}>
        <ErrorBar error={error} />
        {project && (
          <>
            <div className={styles.rowContainer}>
              <h1 className={styles.title}>{project.name}</h1>
              {isEditable && (
                <>
                  <Link to={{ pathname: `/projects/update/${project.id}` }}>
                    <Button
                      icon={<EditRegular />}
                      shape="circular"
                      className={styles.editButton}
                      aria-label="Edit"
                    />
                  </Link>
                  <Button
                    icon={<DeleteRegular />}
                    shape="circular"
                    className={styles.deleteButton}
                    aria-label="Delete"
                    onClick={() => setIsDialogOpen(true)}
                  />
                </>
              )}

              <Dialog
                open={isDialogOpen}
                onOpenChange={(_event, data) => setIsDialogOpen(data.open)}
              >
                <DialogSurface>
                  <DialogBody>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                      Are you sure you want to delete this project? This action
                      cannot be undone.
                    </DialogContent>
                    <DialogActions>
                      <Button appearance="primary" onClick={handleDelete}>
                        Delete
                      </Button>
                      <Button
                        appearance="secondary"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  </DialogBody>
                </DialogSurface>
              </Dialog>
            </div>
            <div className={styles.box}>
              <nav>
                <div className="cd-breadcrumb.box">
                  <ol className="cd-breadcrumb triangle custom-icons">
                    <div className="cd-breadcrumb-main">
                      {template?.stages
                        ?.sort((a, b) => a.order - b.order)
                        .map((stage, index, stageArray) => (
                          <li
                            key={stage.id}
                            className={
                              stage.order <= (project.currentStage?.order ?? 0)
                                ? "current"
                                : ""
                            }
                          >
                            <a>{stage.name}</a>
                            {index < stageArray.length - 1 && (
                              <span className="separator">&gt;</span>
                            )}
                          </li>
                        ))}
                    </div>
                  </ol>
                </div>
              </nav>

              {currentUserId === project.ownerId && (
                <InfoLabel
                  className={styles.infoLabel}
                  size="large"
                  info={
                    requestExists
                      ? "Advance request already exists or the project is in final stage."
                      : project.stakeholders?.length === 0
                      ? "You need at least one stakeholder to advance the stage."
                      : "Send request to stakeholders to advance the stage of the project."
                  }
                >
                  <Button
                    appearance="primary"
                    type="submit"
                    className={styles.button}
                    onClick={handleAdvance}
                    disabled={
                      project.stakeholders?.length === 0 ||
                      requestExists ||
                      isRequestMade
                    }
                  >
                    Advance Stage
                  </Button>
                </InfoLabel>
              )}
            </div>
            <div className={styles.box}>
              <h3>Owner</h3>
              <div>
                {currentUserId === project.ownerId
                  ? "You are the owner of this project"
                  : owner?.email}
              </div>
            </div>
            <div className={styles.box}>
              <h3>Description</h3>
              <div>
                {project.description?.trim() === ""
                  ? "No description"
                  : project.description}
              </div>
            </div>
            <div className={styles.box}>
              <div>
                <Label className={styles.label}>Start Date:</Label>
                <div>{project.startDate.toDateString()}</div>
              </div>
              <div>
                <Label className={styles.label}>End Date:</Label>
                <div>
                  {project.endDate ? project.endDate.toDateString() : "N/A"}
                </div>
              </div>
            </div>

            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
              <Tab value="tab1">Project Details</Tab>
              <Tab value="tab2">Statistics</Tab>
            </TabList>

            {selectedValue === "tab1" && (
              <>
                <div className={styles.box}>
                  <div className={styles.rowContainer}>
                    <h3>Stakeholders</h3>
                    {isEditable && (
                      <Link
                        to={{
                          pathname: `/projects/${project.id}/stakeholders/create`,
                        }}
                      >
                        <Button
                          className={styles.addButton}
                          shape="circular"
                          icon={<AddFilled />}
                        />
                      </Link>
                    )}
                  </div>
                  <StakeholdersTable
                    stakeholders={project?.stakeholders || []}
                    onEditStakeholder={(stakeholderId) =>
                      navigate({
                        pathname: `/projects/${project.id}/stakeholders/${stakeholderId}/update`,
                      })
                    }
                    projectId={project.id || ""}
                    controls={isEditable}
                  />
                </div>
                <div className={styles.box}>
                  <div className={styles.rowContainer}>
                    <h3>Resources</h3>
                    {isEditable && (
                      <Link
                        to={{
                          pathname: `/projects/${project.id}/resources/create`,
                        }}
                      >
                        <Button
                          className={styles.addButton}
                          shape="circular"
                          icon={<AddFilled />}
                        />
                      </Link>
                    )}
                  </div>
                  <ResourcesTable
                    resources={project?.resources || []}
                    onEditResource={(resourceId) =>
                      navigate({
                        pathname: `/projects/${project.id}/resources/${resourceId}/update`,
                      })
                    }
                    projectId={id || ""}
                    controls={isEditable}
                  />
                </div>
                <div className={styles.box}>
                  <div className={styles.rowContainer}>
                    <h3>Tasks</h3>
                    {isEditable && (
                      <Link
                        to={{
                          pathname: `/projects/${project.id}/tasks/create`,
                        }}
                      >
                        <Button
                          className={styles.addButton}
                          shape="circular"
                          icon={<AddFilled />}
                        />
                      </Link>
                    )}
                  </div>
                  <TasksTable
                    tasks={project?.tasks || []}
                    onEditTask={(taskId) =>
                      navigate({
                        pathname: `/projects/${project.id}/tasks/${taskId}/update`,
                      })
                    }
                    projectId={project.id || ""}
                    controls={isEditable}
                  />
                </div>
              </>
            )}
            {selectedValue === "tab2" && (
              <>
                <ProjectTasksGantChart tasks={project.tasks || []} />
                <ProjectResourcesChart resources={project.resources || []} />
              </>
            )}
          </>
        )}
      </div>
    </Navbar>
  );
}
