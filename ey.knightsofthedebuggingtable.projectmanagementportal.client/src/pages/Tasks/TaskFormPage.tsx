import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Button,
  Field,
  Input,
  makeStyles,
  Textarea,
} from "@fluentui/react-components";
import {
  CircleMultipleHintCheckmark28Filled,
  Person20Filled,
} from "@fluentui/react-icons";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { CustomComboBox } from "../../components/CustomComboBox";
import Navbar from "../../components/Navbar";
import ErrorBar from "../../components/ErrorBar";
import handleError, { handleValidationErrors } from "../../util/handleError";
import type { TaskDto } from "../../models/TaskDto";
import {
  createTask,
  getProject,
  getTask,
  updateTask,
  ValidateTask,
} from "../../services/projectService";
import type { ResourceDto } from "../../models/ResourceDto";
import { TaskStatus } from "../../models/TaskStatus";
import { addDays } from "@fluentui/react-calendar-compat";

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

const TaskFormPage = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { projectId, taskId } = useParams<{
    projectId: string;
    taskId: string;
  }>();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [resources, setResouces] = useState<ResourceDto[]>([]);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string>("");

  const handleResourceChange = (selectedUserName: string) => {
    const resource = resources.find(
      (resource) => resource.firstName === selectedUserName
    );

    if (!resource) {
      return;
    }

    setResourceId(resource.id!);
  };

  useEffect(() => {
    if (!projectId) {
      return;
    }

    if (taskId) {
      getTask(projectId, taskId)
        .then((task) => {
          setName(task.name);
          setDescription(task.description || "");
          setStatus(task.status);
          setResourceId(task.resourceId);
          setStartDate(task.startDate);
          setEndDate(task.endDate);
        })
        .catch((error) => {
          handleError(error, setError);
        });
    }

    getProject(projectId)
      .then((project) => {
        setResouces(project.resources || []);
      })
      .catch((error) => {
        setError(
          error instanceof Error ? error.message : "A server error occurred"
        );
      });
  }, [projectId, taskId]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const task: TaskDto = {
      id: taskId,
      name,
      description,
      projectId: projectId!,
      resourceId: resourceId,
      status,
      startDate: startDate as Date,
      endDate: endDate,
    };

    setError("");

    const validationErrors = ValidateTask(task);
    if (validationErrors.length > 0) {
      handleValidationErrors(validationErrors, setError);

      return;
    }

    if (!projectId) {
      return;
    }

    if (taskId) {
      updateTask(projectId, task)
        .then(() => navigate(`/projects/${projectId}/tasks/${taskId}`))
        .catch((error) => {
          handleError(error, setError);
        });
    } else {
      createTask(projectId, task)
        .then((newTask) =>
          navigate(`/projects/${projectId}/tasks/${newTask.id}`)
        )
        .catch((error) => {
          handleError(error, setError);
        });
    }
  };

  return (
    <Navbar>
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>
            {taskId ? "Update Task" : "Create Task"}
          </h1>
        </div>
        <p className={styles.subtitle}>
          {taskId
            ? "Update the details below to modify your task."
            : "Fill in the details below to set up your new task and get started."}
        </p>
        <ErrorBar error={error} />
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.spacing}>
            <Field label="Task Name" size="large" required>
              <Input
                className={styles.field}
                size="large"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
            </Field>
            <Field label="Description" size="large">
              <Textarea
                className={styles.field}
                size="large"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError("");
                }}
              />
            </Field>
            <CustomComboBox
              onSelectionChange={setStatus}
              icon={<CircleMultipleHintCheckmark28Filled />}
              options={TaskStatus}
              label="Select Status"
              value={status}
            />
            {!taskId &&
              (resources?.length === 0 ? (
                <>
                  <div>You must first create a resource to assign a task.</div>
                  <div>
                    Click{" "}
                    <Link to={`/projects/${projectId}/resources/create`}>
                      here
                    </Link>{" "}
                    to create a resource.
                  </div>
                </>
              ) : (
                <CustomComboBox
                  onSelectionChange={handleResourceChange}
                  options={resources.map((u) => u.firstName)}
                  icon={<Person20Filled />}
                  label="Resource"
                />
              ))}

            <div className={styles.dates}>
              <Field size="large" label="Start Date" required>
                <DatePicker
                  className={styles.field}
                  value={startDate || null}
                  onSelectDate={(date) => {
                    setStartDate(date || null);
                    setEndDate(null);
                  }}
                />
              </Field>
              <Field size="large" label="End Date">
                <DatePicker
                  minDate={startDate ? addDays(startDate, 1) : undefined}
                  className={styles.field}
                  value={endDate || null}
                  onSelectDate={setEndDate as (date?: Date | null) => void}
                />
              </Field>
            </div>
          </div>
          <div>
            <Button
              appearance="primary"
              size="large"
              type="submit"
              className={styles.button}
              disabled={error.length > 0}
              //why no diff style?
            >
              {taskId ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </Navbar>
  );
};

export default TaskFormPage;
