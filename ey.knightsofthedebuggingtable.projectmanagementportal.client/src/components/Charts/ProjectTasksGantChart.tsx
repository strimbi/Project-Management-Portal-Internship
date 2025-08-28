import { useEffect, useState } from "react";
import {
  DataVizPalette,
  GanttChart,
  getColorFromToken,
  type GanttChartDataPoint,
} from "@fluentui/react-charts";
import { chartStyles } from "./chartStyles";
import type { TaskDto } from "../../models/TaskDto";
import { format } from "date-fns";

interface ProjectTasksGantChartProps {
  tasks: TaskDto[];
}

export const ProjectTasksGantChart: React.FC<ProjectTasksGantChartProps> = ({
  tasks = [],
}) => {
  const styles = chartStyles();
  const [data, setData] = useState<GanttChartDataPoint[]>([]);

  useEffect(() => {
    const maxDate = tasks.reduce((max, task) => {
      const endDate = task.endDate ? new Date(task.endDate) : new Date();
      return new Date(
        Math.max(
          max.getTime(),
          new Date(task.startDate).getTime(),
          endDate.getTime()
        )
      );
    }, new Date(0));

    const chartData: GanttChartDataPoint[] = tasks.map((task, index) => ({
      x: {
        start: new Date(task.startDate),
        end: task.endDate ? new Date(task.endDate) : maxDate,
      },
      y: task.name,
      legend: task.status,
      color: getColorFromToken(
        DataVizPalette[
          `color${(index % 12) + 1}` as keyof typeof DataVizPalette
        ]
      ),
      formattedStart: format(new Date(task.startDate), "dd.MM.yyyy"),
      formattedEnd: task.endDate
        ? format(new Date(task.endDate), "dd.MM.yyyy")
        : format(maxDate, "dd.MM.yyyy"),
    }));

    setData(chartData);
  });

  return (
    <div className={styles.box}>
      <h3>Project Task Chart</h3>
      <p>Visualizing all tasks for the project.</p>
      <GanttChart data={data} showYAxisLables roundCorners={true} />
    </div>
  );
};
