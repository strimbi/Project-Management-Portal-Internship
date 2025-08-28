import { useEffect, useState } from "react";
import {
  DataVizPalette,
  getColorFromToken,
  HorizontalBarChart,
  type ChartProps,
} from "@fluentui/react-charts";
import { getProjectsProgress } from "../../services/projectService";
import { chartStyles } from "./chartStyles";

export const ProjectProgressionChart = () => {
  const styles = chartStyles();
  const [data, setData] = useState<ChartProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progress = await getProjectsProgress();
        var totalProjects = 0;

        for (var stage in progress) {
          totalProjects += progress[stage];
        }

        const chartData = Object.keys(progress).map((stage, index) => {
          const count = progress[stage];
          return {
            chartTitle: stage,
            chartData: [
              {
                legend: stage,
                horizontalBarChartdata: { x: count, total: totalProjects },
                color: getColorFromToken(
                  DataVizPalette[
                    `color${(index % 8) + 1}` as keyof typeof DataVizPalette
                  ]
                ),
                xAxisCalloutData: `${count} projects`,
                yAxisCalloutData: `${
                  totalProjects > 0
                    ? ((count / totalProjects) * 100).toFixed(2)
                    : 0
                }%`,
              },
            ],
          };
        });

        setData(chartData);
      } catch (error) {
        console.error("Error fetching project progress:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.box}>
      <h3>Project Progression Chart</h3>
      <p>
        Visualizing the distribution of projects across their lifecycle stages.
      </p>
      <HorizontalBarChart
        data={data}
        chartDataMode={"default"}
        className={"hbcbasic"}
      />
    </div>
  );
};
