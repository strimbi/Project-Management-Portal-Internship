import { useEffect, useState } from "react";
import {
  DataVizPalette,
  getColorFromToken,
  HorizontalBarChart,
  type ChartProps,
} from "@fluentui/react-charts";
import { chartStyles } from "./chartStyles";
import type { ResourceDto } from "../../models/ResourceDto";

interface ProjectResourcesChartProps {
  resources: ResourceDto[];
}

type TeamRoleCounts = {
  [team: string]: {
    [role: string]: number;
  };
};

export const ProjectResourcesChart: React.FC<ProjectResourcesChartProps> = ({
  resources = [],
}) => {
  const styles = chartStyles();
  const [data, setData] = useState<ChartProps[]>([]);

  useEffect(() => {
    const teamRoleCounts: TeamRoleCounts = resources.reduce((acc, resource) => {
      const team = resource.team || "Unassigned";
      const role = resource.role || "Unknown";

      if (!acc[team]) {
        acc[team] = {};
      }

      if (!acc[team][role]) {
        acc[team][role] = 0;
      }

      acc[team][role] += 1;

      return acc;
    }, {} as TeamRoleCounts);

    const data = Object.entries(teamRoleCounts).map(([team, roles]) => {
      const chartData = Object.entries(roles).map(([role, count], index) => ({
        legend: `${role}`,
        horizontalBarChartdata: { x: count },
        color: getColorFromToken(
          DataVizPalette[
            `color${(index % 12) + 1}` as keyof typeof DataVizPalette
          ]
        ),
      }));

      return {
        chartTitle: team,
        chartData,
      };
    });

    setData(data);
  }, [resources]);

  return (
    <div className={styles.box}>
      <h3>Project Resources Chart</h3>
      <p>Visualizing resources by team and role.</p>
      <HorizontalBarChart
        data={data}
        chartDataMode={"default"}
        className={"hbcstacked"}
      />
    </div>
  );
};
