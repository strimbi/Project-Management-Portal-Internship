import { makeStyles } from "@fluentui/react-components";

export const chartStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "1rem",
    width: "100%",
    height: "100%",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    borderRadius: "16px",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
