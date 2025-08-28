import { useEffect, useState } from "react";
import { makeStyles, Toaster } from "@fluentui/react-components";
import ErrorBar from "../../components/ErrorBar";
import Navbar from "../../components/Navbar";
import handleError from "../../util/handleError";
import { ApprovalTable } from "../../components/Tables/ApprovalsTable";
import type { ApprovalDto } from "../../models/ApprovalDto";
import {
  approveAdvanceRequest,
  getApprovals,
  rejectAdvanceRequest,
} from "../../services/approvalService";
import { useToast } from "../../hooks/ToasterLink";

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
    overflowX: "auto",
    gap: "1.2rem",
    height: "100%",
    width: "100%",
  },
  tables: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
});

export default function ApprovalsPage() {
  const styles = useStyles();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvals, setApprovals] = useState<ApprovalDto[]>([]);
  const { notify, toasterId } = useToast();

  const fetchApprovals = () => {
    setLoading(true);
    getApprovals()
      .then((approvals) => {
        setApprovals(approvals);
      })
      .catch((error) => handleError(error, setError))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = (approvalId: string) => {
    approveAdvanceRequest(approvalId)
      .then((result) => {
        setApprovals((prevApprovals) =>
          prevApprovals.map((approval) =>
            approval.id === approvalId
              ? { ...approval, status: "Approved", approvedAt: new Date() }
              : approval
          )
        );
        notify("", "", result, "success");
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => handleError(error, setError));
  };

  const handleReject = (approvalId: string) => {
    rejectAdvanceRequest(approvalId)
      .then((result) => {
        setApprovals((prevApprovals) =>
          prevApprovals.map((approval) =>
            approval.id === approvalId
              ? { ...approval, status: "Rejected", approvedAt: new Date() }
              : approval
          )
        );
        notify("", "", result, "error");
      })
      .catch((error) => handleError(error, setError));
  };

  return (
    <Navbar>
      <div className={styles.container}>
        <Toaster toasterId={toasterId} />
        <div className={styles.titleBar}>
          <h1 className={styles.title}>Approvals</h1>
        </div>
        <p className={styles.subtitle}>
          View and manage all your approvals in one place.
        </p>
        <ErrorBar error={error} />
        <div className={styles.tables}>
          <h3>Pending</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ApprovalTable
              approvals={approvals.filter((a) => a.status === "Pending")}
              controls={true}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
          <h3>Approved</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ApprovalTable
              approvals={approvals.filter((a) => a.status === "Approved")}
              controls={false}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
          <h3>Rejected</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ApprovalTable
              approvals={approvals.filter((a) => a.status === "Rejected")}
              controls={false}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>
      </div>
    </Navbar>
  );
}
