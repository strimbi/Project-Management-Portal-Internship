import { makeStyles } from "@fluentui/react-components";

export const inputStyles = makeStyles({
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: "25rem",
    width: "25%",
    padding: "2rem",
    gap: "1rem",
    background: "rgba(255, 255, 255, 0.25)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
  },

  title: {
    fontFamily: "Neuton",
    fontWeight: "700",
    fontStyle: "normal",
    fontSize: "50px",
    padding: "1.5rem",
  },

  field: {
    width: "100%",
    "> div": {
      padding: "0.5rem",
      textAlign: "center",
      fontSize: "16px",
    },
  },
});
