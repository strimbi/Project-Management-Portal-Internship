import { EditRegular, DeleteRegular } from "@fluentui/react-icons";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  useTableFeatures,
  type TableColumnDefinition,
  type TableColumnId,
  useTableSort,
  TableCellLayout,
  createTableColumn,
  Button,
  Dialog,
  DialogBody,
  DialogTitle,
  DialogSurface,
  DialogContent,
  DialogActions,
  Toaster,
} from "@fluentui/react-components";
import { tableStyles } from "./tableStyles";
import type { TaskDto } from "../../models/TaskDto";
import { useState } from "react";
import { deleteTask } from "../../services/projectService";
import handleError from "../../util/handleError";
import ErrorBar from "../ErrorBar";
import { useNavigate } from "react-router";
import { useToast } from "../../hooks/ToasterLink";

interface TasksTableProps {
  tasks: TaskDto[];
  onEditTask: (taskId: string) => void;
  projectId: string;
  controls: boolean;
}

export const TasksTable: React.FC<TasksTableProps> = ({
  tasks = [],
  onEditTask,
  projectId,
  controls,
}) => {
  const styles = tableStyles();
  const navigate = useNavigate();
  const { notify, toasterId } = useToast();

  const [error, setError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [taskItems, setTaskItems] = useState<TaskDto[]>(tasks);

  const columns: TableColumnDefinition<TaskDto>[] = [
    createTableColumn<TaskDto>({
      columnId: "name",
      compare: (a, b) => {
        return a.name.localeCompare(b.name);
      },
    }),
    createTableColumn<TaskDto>({
      columnId: "description",
      compare: (a, b) => {
        return (a.description || "")
          .trim()
          .localeCompare((b.description || "").trim());
      },
    }),
    createTableColumn<TaskDto>({
      columnId: "status",
      compare: (a, b) => {
        return a.status.localeCompare(b.status);
      },
    }),
    createTableColumn<TaskDto>({
      columnId: "startDate",
      compare: (a, b) => {
        return a.startDate.getTime() - b.startDate.getTime();
      },
    }),
    createTableColumn<TaskDto>({
      columnId: "endDate",
      compare: (a, b) => {
        const timeA = a.endDate ? a.endDate.getTime() : 0;
        const timeB = b.endDate ? b.endDate.getTime() : 0;

        return timeA - timeB;
      },
    }),
    createTableColumn<TaskDto>({
      columnId: "resourceName",
      compare: (a, b) => {
        return (a.resourceName || "").localeCompare(b.resourceName || "");
      },
    }),
  ];

  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures<TaskDto>(
    {
      columns,
      items: taskItems,
    },
    [
      useTableSort({
        defaultSortState: { sortColumn: "name", sortDirection: "ascending" },
      }),
    ]
  );

  const headerSortProps = (columnId: TableColumnId) => ({
    onClick: (e: React.MouseEvent) => {
      toggleColumnSort(e, columnId);
    },
    sortDirection: getSortDirection(columnId),
  });

  const rows = sort(getRows());

  const handleDelete = () => {
    setIsDialogOpen(false);

    if (!selectedId) {
      return;
    }

    deleteTask(projectId, selectedId)
      .then(() =>
        setTaskItems((prevTasks) =>
          prevTasks.filter((task) => task.id !== selectedId)
        )
      )
      .then(() => notify("", "", "Deleted successfully", "success"))
      .catch((error) => handleError(error, setError));
  };

  return (
    <div className={styles.tableContainer}>
      <Toaster toasterId={toasterId} />
      <Dialog
        open={isDialogOpen}
        onOpenChange={(_event, data) => setIsDialogOpen(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={handleDelete}>
                Delete
              </Button>
              <Button
                appearance="secondary"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Table
        className={styles.table}
        sortable
        aria-label="Table with sort"
        style={{ minWidth: "500px" }}
      >
        <ErrorBar error={error} />
        <TableHeader>
          <TableRow className={styles.tableHeader}>
            <TableHeaderCell {...headerSortProps("name")}>Name</TableHeaderCell>
            <TableHeaderCell {...headerSortProps("description")}>
              Details
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("status")}>
              Status
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("startDate")}>
              Start Date
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("endDate")}>
              End Date
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("resourceName")}>
              Resource Name
            </TableHeaderCell>
            {controls && (
              <>
                <TableHeaderCell
                  className={styles.moreButtonContainer}
                ></TableHeaderCell>
                <TableHeaderCell
                  className={styles.moreButtonContainer}
                ></TableHeaderCell>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map(({ item }) => (
              <TableRow key={item.name}>
                <TableCell>
                  <TableCellLayout
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/projects/${projectId}/tasks/${item.id}`)
                    }
                  >
                    {item.name}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout className={styles.textOverflow}>
                    {item.description}
                  </TableCellLayout>
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{new Date(item.startDate).toDateString()}</TableCell>
                <TableCell>
                  {item.endDate ? new Date(item.endDate).toDateString() : "N/A"}
                </TableCell>
                <TableCell>
                  <TableCellLayout>
                    {item.resourceName || "N/A"}
                  </TableCellLayout>
                </TableCell>
                {controls && (
                  <>
                    <TableCell>
                      <TableCellLayout>
                        <Button
                          icon={<EditRegular />}
                          shape="circular"
                          onClick={() => onEditTask(item.id || "")}
                          className={styles.editButton}
                          aria-label="Edit"
                        />
                      </TableCellLayout>
                    </TableCell>
                    <TableCell>
                      <TableCellLayout>
                        <Button
                          icon={<DeleteRegular />}
                          shape="circular"
                          className={styles.deleteButton}
                          onClick={() => {
                            setSelectedId(item.id);
                            setIsDialogOpen(true);
                          }}
                          aria-label="Delete"
                        />
                      </TableCellLayout>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No task</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
