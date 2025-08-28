import { Button, Field, Input, makeStyles } from "@fluentui/react-components";
import { Person20Filled } from "@fluentui/react-icons";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { CustomComboBox } from "../../components/CustomComboBox";
import type { StakeholderDto } from "../../models/StakeholderDto";
import {
  createStakeholder,
  getStakeholder,
  updateStakeholder,
} from "../../services/stakeholderService";
import type { UserDto } from "../../models/UserDto";
import { getUsersNotAssignedAsStakeholders } from "../../services/userService";
import { useNavigate, useParams } from "react-router";
import handleError from "../../util/handleError";
import ErrorBar from "../../components/ErrorBar";

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
  dates: {
    display: "flex",
    alignItems: "center",
    gap: "3rem",
  },
  spacing: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  button: {
    borderRadius: "16px",
  },
});

export default function StakeholderFormPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  const { projectId, stakeholderId } = useParams<{
    projectId: string;
    stakeholderId: string;
  }>();

  const [role, setRole] = useState<string>("");
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [stakeholder, setStakeholder] = useState<StakeholderDto>();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    getUsersNotAssignedAsStakeholders(projectId)
      .then((users) => setUsers(users))
      .catch((error) => handleError(error, setError));

    if (stakeholderId) {
      getStakeholder(projectId, stakeholderId)
        .then((stakeholder) => {
          setStakeholder(stakeholder);
          setRole(stakeholder.role);
        })
        .catch((error) => handleError(error, setError));
    }
  }, [projectId, stakeholderId]);

  const handleUsers = (selectedUser: string) => {
    const user = users.find((user) => user.email === selectedUser);

    if (!user) {
      return;
    }

    setSelectedUser(user.id);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectId) {
      return;
    }

    const stakeholder: StakeholderDto = {
      userId: selectedUser,
      projectId: projectId,
      role: role,
    };

    if (stakeholderId) {
      updateStakeholder(projectId, stakeholder)
        .then(() =>
          navigate(`/projects/${projectId}/stakeholders/${stakeholderId}`)
        )
        .catch((error) => handleError(error, setError));
    } else {
      createStakeholder(projectId, stakeholder)
        .then((newStakeholder) =>
          navigate(`/projects/${projectId}/stakeholders/${newStakeholder.id}`)
        )
        .catch((error) => handleError(error, setError));
    }
  };

  return (
    <Navbar>
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>
            {stakeholderId ? "Update Stakeholder" : "Create Stakeholder"}
          </h1>
        </div>
        <p className={styles.subtitle}>
          {stakeholderId
            ? "Update the details below to modify your stakeholder."
            : "Fill in the details below to set up your new stakeholder and get started."}
        </p>
        <ErrorBar error={error} />
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.spacing}>
            {!stakeholderId ? (
              <CustomComboBox
                onSelectionChange={handleUsers}
                options={users.map((u) => u.email)}
                icon={<Person20Filled />}
                label="User"
              />
            ) : (
              <>
                <h3>User</h3>
                <p>{users.find((x) => x.id == stakeholder?.userId)?.email}</p>
              </>
            )}

            <Field label="Role" size="large" required>
              <Input
                className={styles.field}
                size="large"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </Field>
          </div>
          <div>
            <Button
              appearance="primary"
              size="large"
              type="submit"
              className={styles.button}
            >
              {stakeholderId ? "Update Stakeholder" : "Create Stakeholder"}
            </Button>
          </div>
        </form>
      </div>
    </Navbar>
  );
}
