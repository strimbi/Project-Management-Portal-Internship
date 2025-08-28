import * as React from "react";
import {
  VerticalStackedBarChart,
  type VerticalStackedChartProps,
  getColorFromToken,
  DataVizPalette,
} from "@fluentui/react-charts";
import { getProjectTasksStatus } from "../../services/projectService";
import { chartStyles } from "./chartStyles";

export const ProjectTaskChart = () => {
  const styles = chartStyles();
  const [data, setData] = React.useState<VerticalStackedChartProps[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const projectTasksStatus = await getProjectTasksStatus();

        const chartData: VerticalStackedChartProps[] = projectTasksStatus.map(
          (project) => ({
            chartData: [
              {
                legend: "Not Started",
                data: project.notStarted,
                color: getColorFromToken(DataVizPalette.color1),
              },
              {
                legend: "In Progress",
                data: project.inProgress,
                color: getColorFromToken(DataVizPalette.color2),
              },
              {
                legend: "On Hold",
                data: project.onHold,
                color: getColorFromToken(DataVizPalette.color3),
              },
              {
                legend: "Completed",
                data: project.completed,
                color: getColorFromToken(DataVizPalette.color4),
              },
            ],
            xAxisPoint: project.projectName,
          })
        );

        setData(chartData);
      } catch (error) {
        console.error("Error fetching project tasks status:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.box}>
      <h3>Project Task Chart</h3>
      <p>Visualizing the distribution of task status.</p>
      <VerticalStackedBarChart
        chartTitle="Tasks Status per Project"
        data={data}
        roundCorners={true}
      />
    </div>
  );
};
