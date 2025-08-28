import { makeStyles } from "@fluentui/react-components";
import Navbar from "../../components/Navbar";
import { ProjectProgressionChart } from "../../components/Charts/ProjectProgressionChart";
import { ProjectGantChart } from "../../components/Charts/ProjectGantChart";
import { ProjectDonutChart } from "../../components/Charts/ProjectDonutChart";
import { ProjectTaskChart } from "../../components/Charts/ProjectTaskChart";

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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    ridTemplateRows: "repeat(2, 1fr)",
    gap: "1rem",
    width: "100%",
    height: "100%",
    overflowX: "auto",
  },
});

export default function Analytics() {
  const styles = useStyles();

  return (
    <Navbar>
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>Analytics</h1>
        </div>
        <p className={styles.subtitle}>
          View and analyse all your projects statistics in one place.
        </p>
        <div className={styles.grid}>
          <ProjectTaskChart />
          <ProjectGantChart />
          <ProjectProgressionChart />
          <ProjectDonutChart />
        </div>
      </div>
    </Navbar>
  );
}
