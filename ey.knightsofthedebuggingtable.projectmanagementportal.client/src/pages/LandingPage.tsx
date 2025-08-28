import { Button, makeStyles, tokens } from "@fluentui/react-components";
import { Link } from "react-router";

const useStyles = makeStyles({
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
    gap: "3.5rem",
  },
  title: {
    fontFamily: "Neuton",
    fontWeight: "700",
    fontStyle: "normal",
    fontSize: "6.5rem",
  },
  subtitle: {
    fontWeight: "500",
    fontSize: "1.25rem",
    color: tokens.colorNeutralForeground2,
  },
  buttons: {
    display: "flex",
    alignOtems: "center",
    gap: "2rem",
  },
});

export default function LandingPage() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Project Management Portal</h1>
        <p className={styles.subtitle}>
          Manage your projects, resources and tasks.
        </p>
        <div className={styles.buttons}>
          <Link to={"/login"}>
            <Button appearance="primary" size="large">
              Log in
            </Button>
          </Link>
          <Link to={"/register"}>
            <Button size="large">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
