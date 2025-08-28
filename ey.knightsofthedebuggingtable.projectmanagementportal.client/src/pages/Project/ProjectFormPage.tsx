import {
  Button,
  Field,
  Input,
  makeStyles,
  Textarea,
} from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { addDays } from "@fluentui/react-calendar-compat";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import {
  createProject,
  getProject,
  updateProject,
  validateProject,
} from "../../services/projectService";
import type { ProjectDto } from "../../models/ProjectDto";
import ErrorBar from "../../components/ErrorBar";
import { Link, useNavigate, useParams } from "react-router";
import handleError, { handleValidationErrors } from "../../util/handleError";
import type { TemplateDto } from "../../models/TemplateDto";
import { getTemplates } from "../../services/templateService";
import { CustomComboBox } from "../../components/CustomComboBox";
import { BookTemplate20Filled, Person20Filled } from "@fluentui/react-icons";
import { getUsers } from "../../services/userService";
import type { UserDto } from "../../models/UserDto";

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

const ProjectFormPage = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [createdBy, setCreatedBy] = useState<string>();
  const [error, setError] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [templates, setTemplates] = useState<TemplateDto[]>();

  useEffect(() => {
    Promise.all([getTemplates(), getUsers()])
      .then(([templates, users]) => {
        setTemplates(templates);
        setUsers(users);
      })
      .catch((error) => handleError(error, setError));

    if (!id) {
      return;
    }

    getProject(id)
      .then((project) => {
        setName(project.name);
        setDescription(project.description ?? "");
        setStartDate(project.startDate);
        setEndDate(project.endDate ?? null);
        setCreatedBy(project.createdBy);
        setSelectedTemplateId(project.templateId);
        setSelectedUserId(project.ownerId);
      })
      .catch((error) => handleError(error, setError));
  }, []);

  const handleTemplates = (selectedTemplate: string) => {
    const template = templates?.find(
      (template) => template.name === selectedTemplate
    );

    if (template && template.id) {
      setSelectedTemplateId(template.id);
    }
  };

  const handleUsers = (selectedUser: string) => {
    const user = users.find((user) => user.email === selectedUser);

    if (user) {
      setSelectedUserId(user.id);
    }
  };

  const handleButton = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const project: ProjectDto = {
      name: name.trim(),
      description: description.trim(),
      startDate: startDate ? startDate : new Date(),
      endDate: endDate ? endDate : undefined,
      createdBy: createdBy,
      templateId: selectedTemplateId,
      ownerId: selectedUserId,
    };

    const validationErrors = validateProject(project);

    if (validationErrors.length > 0) {
      handleValidationErrors(validationErrors, setError);

      return;
    }

    if (id) {
      updateProject(id, project)
        .then(() => navigate(`/projects/${id}`))
        .catch((error) => {
          handleError(error, setError);
        });
    } else {
      createProject(project)
        .then((project) => navigate(`/projects/${project.id}`))
        .catch((error) => handleError(error, setError));
    }
  };

  return (
    <Navbar>
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>
            {id ? "Update Project" : "Create Project"}
          </h1>
        </div>
        <p className={styles.subtitle}>
          {id
            ? "Update the details below to modify your project."
            : "Fill in the details below to set up your new project and get started."}
        </p>
        <ErrorBar error={error} />
        <form className={styles.form} onSubmit={handleButton}>
          <div className={styles.spacing}>
            <Field label="Project Name" size="large" required>
              <Input
                className={styles.field}
                size="large"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field size="large" label="Project Description">
              <Textarea
                className={styles.field}
                resize="vertical"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
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
            {!id &&
              (templates?.length === 0 ? (
                <>
                  <div>
                    You must first create a template to create a project.
                  </div>
                  <div>
                    Cick <Link to="/templates/create">here</Link> to create a
                    template.
                  </div>
                </>
              ) : (
                <CustomComboBox
                  onSelectionChange={handleTemplates}
                  options={templates?.map((t) => t.name) ?? []}
                  icon={<BookTemplate20Filled />}
                  label="Template"
                />
              ))}
            {!id && (
              <CustomComboBox
                onSelectionChange={handleUsers}
                options={users.map((u) => u.email)}
                icon={<Person20Filled />}
                label="Owner"
              />
            )}
          </div>
          <div>
            <Button
              appearance="primary"
              size="large"
              type="submit"
              className={styles.button}
              disabled={templates?.length === 0}
            >
              {id ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </Navbar>
  );
};

export default ProjectFormPage;
