import { Button, Field, Input, makeStyles } from "@fluentui/react-components";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import type { ResourceDto } from "../../models/ResourceDto";
import ErrorBar from "../../components/ErrorBar";
import { useNavigate, useParams } from "react-router";
import handleError, { handleValidationErrors } from "../../util/handleError";
import {
  createResource,
  getResource,
  updateResource,
  ValidateResource,
} from "../../services/projectService";
import { CustomComboBox } from "../../components/CustomComboBox";
import { Person20Filled, PersonBriefcaseFilled } from "@fluentui/react-icons";
import type { UserDto } from "../../models/UserDto";
import { getUsersNotAssignedAsResources } from "../../services/userService";
import { ResourceRoles } from "../../models/ResourceRole";

const useStyles = makeStyles({
  title: {
    fontFamily: "Neuton",
    fontWeight: "700",
    fontStyle: "normal",
    fontSize: "2.5rem",
    paddingBottom: "0.5rem",
  },
  subtitle: {
    fontFamily: "Noto Sans",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: "1rem",
  },
  titleBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "1rem",
  },
  addButton: {
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    height: "100%",
    width: "100%",
  },
  field: {
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    width: "100%",
  },
  form: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    gap: "1rem",
    width: "100%",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    borderRadius: "16px",
  },
  spacing: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  button: {
    borderRadius: "16px",
  },
  disabledButton: {
    background: "transparent",
    border: "none",
    color: "rgba(255, 255, 255, 0.5)",
  },
});

const ResourceFormPage = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { projectId, resourceId } = useParams<{
    projectId: string;
    resourceId: string;
  }>();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [users, setUsers] = useState<UserDto[]>([]);
  const [team, setTeam] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleUsers = (selectedUser: string) => {
    const user = users.find((user) => user.email === selectedUser);

    if (!user) {
      return;
    }
    setUserId(user.id);
  };

  useEffect(() => {
    if (!projectId) {
      return;
    }

    if (resourceId) {
      getResource(projectId, resourceId)
        .then((resource) => {
          setFirstName(resource.firstName);
          setLastName(resource.lastName);
          setRole(resource.role);
          setUserId(resource.userId);
          setTeam(resource.team || "");
          setEmail(resource.email);
        })
        .catch((error) => {
          handleError(error, setError);
        });
    }

    getUsersNotAssignedAsResources(projectId)
      .then((users) => setUsers(users))
      .catch((error) => {
        handleError(error, setError);
      });
  }, [projectId, resourceId]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resource: ResourceDto = {
      id: resourceId,
      firstName,
      lastName,
      role,
      projectId: projectId!,
      userId,
      team,
      email,
    };

    const validationErrors = ValidateResource(resource);
    if (validationErrors.length > 0) {
      handleValidationErrors(validationErrors, setError);

      return;
    }

    if (!projectId) {
      return;
    }

    if (resourceId) {
      updateResource(projectId, resource)
        .then(() => navigate(`/projects/${projectId}/resources/${resourceId}`))
        .catch((error) => {
          setError(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        });
    } else {
      createResource(projectId, resource)
        .then((newResource) =>
          navigate(`/projects/${projectId}/resources/${newResource.id}`)
        )
        .catch((error) => {
          setError(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        });
    }
  };

  return (
    <Navbar>
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>
            {resourceId ? "Update Resource" : "Create Resource"}
          </h1>
        </div>
        <p className={styles.subtitle}>
          {resourceId
            ? "Update the details below to modify your resource."
            : "Fill in the details below to set up your new resource and get started."}
        </p>
        <ErrorBar error={error} />
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.spacing}>
            <Field label="First Name" size="large" required>
              <Input
                className={styles.field}
                size="large"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field label="Last Name" size="large" required>
              <Input
                className={styles.field}
                size="large"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
            <CustomComboBox
              onSelectionChange={setRole}
              icon={<PersonBriefcaseFilled />}
              options={ResourceRoles}
              label="Select Role"
              value={role}
            />
            {!resourceId && (
              <CustomComboBox
                onSelectionChange={handleUsers}
                options={users.map((u) => u.email)}
                icon={<Person20Filled />}
                label="User"
              />
            )}
            <Field label="Team" size="large" required>
              <Input
                className={styles.field}
                size="large"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </Field>
          </div>
          <div>
            <Button
              appearance="primary"
              size="large"
              type="submit"
              className={`${styles.button} ${
                error.length > 0 ? styles.disabledButton : ""
              }`}
              disabled={error.length > 0}
            >
              {resourceId ? "Update Resource" : "Create Resource"}
            </Button>
          </div>
        </form>
      </div>
    </Navbar>
  );
};

export default ResourceFormPage;
