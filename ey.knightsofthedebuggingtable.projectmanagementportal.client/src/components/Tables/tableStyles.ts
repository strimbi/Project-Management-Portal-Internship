import { makeStyles } from "@fluentui/react-components";

export const tableStyles = makeStyles({
  addButton: {
    background: "rgba(255, 255, 255, 0.25)",
    color: "rgba(186, 2, 128, 1)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  deleteButton: {
    background: "rgba(255, 255, 255, 0.25)",
    color: "rgba(225, 4, 4, 1)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  approveButton: {
    background: "rgba(255, 255, 255, 0.25)",
    color: "rgba(34, 165, 17, 1)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  editButton: {
    background: "rgba(255, 255, 255, 0.25)",
    color: "rgba(116, 98, 98, 1)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
  tableRow: {
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  table: { width: "100%" },

  tableHeader: {
    color: "#333",
    fontWeight: "700",
    borderTop: "1px rgba(204, 199, 199, 0.25)",
    borderBottom: "1px solid gray",
    "> *": {
      color: "#333",
      fontWeight: "600",
    },
  },
  tableContainer: {
    padding: "0.5rem",
    background: "rgba(255, 255, 255, 0.25)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    overflow: "auto",
  },
  moreButtonContainer: {
    width: "3rem",
  },
  textOverflow: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});
