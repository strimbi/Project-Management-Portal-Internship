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
  Label,
  makeStyles,
} from "@fluentui/react-components";
import {
  ArrowLeft28Filled,
  DeleteRegular,
  EditRegular,
} from "@fluentui/react-icons";
import Navbar from "../../components/Navbar";
import ErrorBar from "../../components/ErrorBar";
import { deleteTask, getTask } from "../../services/projectService";
import handleError from "../../util/handleError";
import type { TaskDto } from "../../models/TaskDto";

const useStyles = makeStyles({
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
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.5rem",
  },
  label: {
    fontWeight: "700",
  },
  backButton: {
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    width: "30px",
    height: "30px",
    padding: "0",
  },
  progress: {
    cursor: "default !important",
  },
});

export default function TaskDetailsPage() {
  const { projectId, taskId } = useParams<{
    projectId: string;
    taskId: string;
  }>();

  const styles = useStyles();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskDto>();
  const [error, setError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!taskId || !projectId) {
      return;
    }

    getTask(projectId, taskId)
      .then((task) => {
        setTask(task);
      })
      .catch((error) => handleError(error, setError));
  }, [projectId, taskId]);

  const handleDelete = () => {
    setIsDialogOpen(false);

    if (!projectId || !taskId) {
      return;
    }

    deleteTask(projectId, taskId)
      .then(() => navigate("/projects"))
      .catch((error) => handleError(error, setError));
  };

  return (
    <Navbar>
      <div className={styles.container}>
        <Link
          to={{
            pathname: `/projects/${projectId}`,
          }}
        >
          <Button
            icon={<ArrowLeft28Filled />}
            shape="circular"
            className={styles.backButton}
          ></Button>
        </Link>
        <ErrorBar error={error} />
        {task && (
          <>
            <div className={styles.rowContainer}>
              <h1 className={styles.title}>{task.name}</h1>
              <Link
                to={{
                  pathname: `/projects/${projectId}/tasks/${taskId}/update`,
                }}
              >
                <Button
                  icon={<EditRegular />}
                  shape="circular"
                  className={styles.addButton}
                  aria-label="Edit"
                />
              </Link>
              <Button
                icon={<DeleteRegular />}
                shape="circular"
                className={styles.addButton}
                aria-label="Delete"
                onClick={() => setIsDialogOpen(true)}
              />
            </div>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(_event, data) => setIsDialogOpen(data.open)}
            >
              <DialogSurface>
                <DialogBody>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogContent>
                    Are you sure you want to delete this task? This action
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

            <div className={styles.box}>
              <h3>Status:</h3>
              <div>{task.status || "Status not set"}</div>
            </div>

            <div className={styles.box}>
              <h3>Description</h3>
              <div>
                {task.description?.trim() === ""
                  ? "No description"
                  : task.description}
              </div>
            </div>
            <div className={styles.box}>
              <div>
                <Label className={styles.label}>Start Date:</Label>
                <div>{new Date(task.startDate).toDateString()}</div>
              </div>
              <div>
                <Label className={styles.label}>End Date:</Label>
                <div>
                  {task.endDate ? new Date(task.endDate).toDateString() : "N/A"}
                </div>
              </div>
            </div>
            <div className={styles.box}>
              <h3>Resource Name</h3>
              <div>{task.resourceName || "Not assigned"}</div>
            </div>
          </>
        )}
      </div>
    </Navbar>
  );
}
