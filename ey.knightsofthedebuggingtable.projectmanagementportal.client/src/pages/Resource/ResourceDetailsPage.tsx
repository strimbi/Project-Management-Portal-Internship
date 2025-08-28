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
} from "@fluentui/react-components";
import {
  ArrowLeft28Filled,
  DeleteRegular,
  EditRegular,
} from "@fluentui/react-icons";
import Navbar from "../../components/Navbar";
import ErrorBar from "../../components/ErrorBar";
import { deleteResource, getResource } from "../../services/projectService";
import handleError from "../../util/handleError";
import type { ResourceDto } from "../../models/ResourceDto";
import { getUser } from "../../services/userService";
import type { UserDto } from "../../models/UserDto";

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
  const { projectId, resourceId } = useParams<{
    projectId: string;
    resourceId: string;
  }>();

  const styles = useStyles();
  const navigate = useNavigate();

  const [resource, setTask] = useState<ResourceDto>();
  const [user, setUser] = useState<UserDto>();
  const [error, setError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!resourceId || !projectId) {
      return;
    }

    getResource(projectId, resourceId)
      .then((resource) => {
        setTask(resource);

        return getUser(resource.userId).then((user) => setUser(user));
      })
      .catch((error) => handleError(error, setError));
  }, [projectId, resourceId]);

  const handleDelete = () => {
    setIsDialogOpen(false);

    if (!projectId || !resourceId) {
      return;
    }

    deleteResource(projectId, resourceId)
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
        {resource && user && (
          <>
            <div className={styles.rowContainer}>
              <h1 className={styles.title}>
                {resource.firstName} {resource.lastName}
              </h1>
              <Link
                to={{
                  pathname: `/projects/${projectId}/resources/${resourceId}/update`,
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
                    Are you sure you want to delete this resource? This action
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
              <h3>Role</h3>
              <div>{resource.role}</div>
            </div>
            <div className={styles.box}>
              <h3>Team</h3>
              <div>{resource.team}</div>
            </div>
            <div className={styles.box}>
              <h3>Email</h3>
              <div>{user.email}</div>
            </div>
          </>
        )}
      </div>
    </Navbar>
  );
}
