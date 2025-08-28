import { useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { AdvanceRequestTable } from "../../components/Tables/AdvanceRequestTable";
import ErrorBar from "../../components/ErrorBar";
import Navbar from "../../components/Navbar";
import handleError from "../../util/handleError";
import { getAdvanceRequests } from "../../services/advanceRequestService";
import { getStages } from "../../services/stageService";
import type { AdvanceRequestDto } from "../../models/AdvanceRequestDto";
import type { StageDto } from "../../models/StageDto";

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
    justifyContent: "flex-start",
    gap: "1.2rem",
    height: "100%",
    width: "100%",
  },
});

export default function AdvanceRequestPage() {
  const styles = useStyles();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<AdvanceRequestDto[]>([]);
  const [stages, setStages] = useState<StageDto[]>([]);

  useEffect(() => {
    Promise.all([getAdvanceRequests(), getStages()])
      .then(([requestsResult, stagesResult]) => {
        setRequests(requestsResult);
        setStages(stagesResult);
      })
      .catch((error) => handleError(error, setError))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Navbar>
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>Advance Requests</h1>
        </div>
        <p className={styles.subtitle}>
          View and manage all your advance requests in one place.
        </p>
        <ErrorBar error={error} />
        <h3>Pending</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <AdvanceRequestTable
            requests={requests.filter((r) => r.status === "Pending")}
            stages={stages}
          />
        )}
        <h3>Approved</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <AdvanceRequestTable
            requests={requests.filter((r) => r.status === "Approved")}
            stages={stages}
          />
        )}
        <h3>Rejected</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <AdvanceRequestTable
            requests={requests.filter((r) => r.status === "Rejected")}
            stages={stages}
          />
        )}
      </div>
    </Navbar>
  );
}
