import Navbar from "../../components/Navbar";
import {
  Button,
  makeStyles,
  SearchBox,
  type SearchBoxChangeEvent,
  type InputOnChangeData,
} from "@fluentui/react-components";
import { Add20Filled } from "@fluentui/react-icons";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import ErrorBar from "../../components/ErrorBar";
import handleError from "../../util/handleError";
import type { TemplateDto } from "../../models/TemplateDto";
import { getTemplates } from "../../services/templateService";
import TemplatesTable from "../../components/Tables/TemplatesTable";

const useStyles = makeStyles({
  title: {
    fontFamily: "Neuton",
    fontWeight: "700",
    fontStyle: "normal",
    fontSize: "2.5rem",
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
    gap: "1rem",
    overflow: "auto",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
  },
  searchBox: {
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  moreButtonContainer: {
    width: "3rem",
  },
});

export default function TemplatesPage() {
  const styles = useStyles();
  const [templates, setTemplates] = useState<TemplateDto[]>([]);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (
    _event: SearchBoxChangeEvent,
    data: InputOnChangeData
  ) => {
    setSearchQuery(data.value);
  };

  useEffect(() => {
    getTemplates()
      .then((fetchedTemplates) => {
        setTemplates(fetchedTemplates);
      })
      .catch((error) => handleError(error, setError));
  }, []);

  const filteredTemplates = templates.filter((template) => {
    return (
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <Navbar>
        <div className={styles.container}>
          <div className={styles.titleBar}>
            <h1 className={styles.title}>All Templates</h1>
            <Link to="/templates/create">
              <Button
                className={styles.addButton}
                shape="circular"
                icon={<Add20Filled />}
              />
            </Link>
          </div>
          <p className={styles.subtitle}>
            View and manage all your templates in one place.
          </p>
          <SearchBox
            size="large"
            className={styles.searchBox}
            onChange={handleSearch}
          />
          <ErrorBar error={error} />
          {!error && <TemplatesTable templates={filteredTemplates} />}
        </div>
      </Navbar>
    </div>
  );
}
