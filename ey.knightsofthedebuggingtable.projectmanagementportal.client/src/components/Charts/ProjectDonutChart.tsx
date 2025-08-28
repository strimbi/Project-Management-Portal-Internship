import {
  DonutChart,
  type ChartProps,
  getColorFromToken,
  DataVizPalette,
} from "@fluentui/react-charts";
import { getProjectStatus } from "../../services/projectService";
import { useEffect, useState } from "react";
import { chartStyles } from "./chartStyles";

export const ProjectDonutChart = () => {
  const styles = chartStyles();
  const [data, setData] = useState<ChartProps>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectStatus();
        const { finalStageProjects, totalProjects } = response;
        setValue(finalStageProjects);

        const points = [
          {
            legend: "Final Stage Projects",
            data: finalStageProjects,
            color: getColorFromToken(DataVizPalette.color1),
            xAxisCalloutData: `${finalStageProjects} projects in final stage`,
          },
          {
            legend: "Total Projects",
            data: totalProjects - finalStageProjects,
            color: getColorFromToken(DataVizPalette.color4),
            xAxisCalloutData: `${
              totalProjects - finalStageProjects
            } projects remaining`,
          },
        ];

        const chartData: ChartProps = {
          chartTitle: "Project Status Overview",
          chartData: points,
        };

        setData(chartData);
      } catch (error) {
        console.error("Error fetching project status:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.box}>
      <h3>Project Completion Chart</h3>
      <p>Visualizing the projects in the final stage.</p>
      <DonutChart
        className={styles.center}
        data={data}
        legendsOverflowText={"overflow Items"}
        hideLegend={false}
        innerRadius={55}
        valueInsideDonut={value}
      />
    </div>
  );
};
