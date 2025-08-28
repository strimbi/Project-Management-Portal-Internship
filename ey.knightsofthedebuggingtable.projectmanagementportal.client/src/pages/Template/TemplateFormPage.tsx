import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Checkbox,
  Field,
  Input,
  makeStyles,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import ErrorBar from "../../components/ErrorBar";
import Navbar from "../../components/Navbar";
import handleError, { handleValidationErrors } from "../../util/handleError";
import { getStages } from "../../services/stageService";
import {
  createTemplate,
  validateTemplate,
} from "../../services/templateService";
import type { TemplateDto } from "../../models/TemplateDto";
import type { StageDto } from "../../models/StageDto";

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
  checkBox: {
    color: tokens.colorNeutralForeground1,
    paddingRight: "1rem",
  },
  checkBoxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTom: "1rem",
    paddingBottom: "1rem",
  },
  checkBoxTitle: {
    fontWeight: "600",
    fontSize: "1rem",
    paddingBottom: "0.5rem",
  },
});

const TemplateFormPage = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [stages, setStages] = useState<StageDto[]>([]);
  const [error, setError] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedStages, setSelectedStages] = useState<StageDto[]>([]);

  useEffect(() => {
    getStages()
      .then((rStages) => {
        setStages(rStages.sort((a, b) => a.order - b.order));
        setSelectedStages(rStages.filter((stage) => stage.isMandatory));
      })
      .catch((error) => handleError(error, setError));
  }, []);

  const handleStageChange = (stage: StageDto, isChecked: boolean) => {
    setSelectedStages((prev) => {
      return isChecked
        ? [...prev, stage]
        : prev.filter((s) => s.id !== stage.id);
    });
  };

  const handleButton = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const template: TemplateDto = {
      name: name.trim(),
      description: description.trim(),
      stages: selectedStages,
    };
    const validationErrors = validateTemplate(template);

    if (validationErrors.length > 0) {
      handleValidationErrors(validationErrors, setError);

      return;
    }

    createTemplate(template)
      .then(() => navigate("/templates"))
      .catch((error) => handleError(error, setError));
  };

  return (
    <Navbar>
      <div className={styles.container}>
        <h1 className={styles.title}>Create Template</h1>
        <ErrorBar error={error} />
        <form className={styles.form} onSubmit={handleButton}>
          <div className={styles.spacing}>
            <Field label="Template Name" size="large" required>
              <Input
                className={styles.field}
                size="large"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field size="large" label="Template Description">
              <Textarea
                className={styles.field}
                resize="vertical"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <Field size="large" label="Stages">
              {stages.length > 0 ? (
                stages.map((stage) => (
                  <div key={stage.id} className={styles.checkBoxContainer}>
                    <Checkbox
                      className={styles.checkBox}
                      size="large"
                      checked={selectedStages.some((s) => s.id === stage.id)}
                      disabled={stage.isMandatory}
                      onChange={(e) =>
                        handleStageChange(stage, e.target.checked)
                      }
                    ></Checkbox>
                    <div>
                      <p className={styles.checkBoxTitle}>{stage.name}</p>
                      <p>{stage.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div>Loading...</div>
              )}
            </Field>
          </div>
          <div>
            <Button
              appearance="primary"
              size="large"
              type="submit"
              className={styles.button}
            >
              Create Template
            </Button>
          </div>
        </form>
      </div>
    </Navbar>
  );
};

export default TemplateFormPage;
