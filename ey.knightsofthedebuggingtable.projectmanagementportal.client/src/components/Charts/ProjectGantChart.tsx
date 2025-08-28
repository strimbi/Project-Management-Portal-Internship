import { useEffect, useState } from "react";
import {
  DataVizPalette,
  GanttChart,
  getColorFromToken,
  type GanttChartDataPoint,
} from "@fluentui/react-charts";
import { getProjects } from "../../services/projectService";
import { chartStyles } from "./chartStyles";

export const ProjectGantChart = () => {
  const styles = chartStyles();
  const [data, setData] = useState<GanttChartDataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await getProjects();
        const currentYear = new Date().getFullYear();

        const filteredProjects = projects.filter((project) => {
          const startDate = new Date(project.startDate);
          const endDate = project.endDate
            ? new Date(project.endDate)
            : new Date();
          return (
            startDate.getFullYear() === currentYear ||
            endDate.getFullYear() === currentYear
          );
        });

        const maxDate = filteredProjects.reduce((max, project) => {
          const endDate = project.endDate
            ? new Date(project.endDate)
            : new Date();
          return new Date(
            Math.max(
              max.getTime(),
              new Date(project.startDate).getTime(),
              endDate.getTime()
            )
          );
        }, new Date(0));

        const chartData: GanttChartDataPoint[] = filteredProjects.map(
          (project, index) => ({
            x: {
              start: new Date(project.startDate),
              end: project.endDate ? new Date(project.endDate) : maxDate,
            },
            y: project.name,
            legend: project.name,
            color: getColorFromToken(
              DataVizPalette[
                `color${(index % 12) + 1}` as keyof typeof DataVizPalette
              ]
            ),
          })
        );

        setData(chartData);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.box}>
      <h3>Project Timeline Chart</h3>
      <p>Visualizing the timeline of all projects in the current year.</p>
      <GanttChart data={data} showYAxisLables roundCorners={true} />
    </div>
  );
};
