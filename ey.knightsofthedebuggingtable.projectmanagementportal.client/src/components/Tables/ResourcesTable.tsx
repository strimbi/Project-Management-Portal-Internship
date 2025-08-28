import * as React from "react";
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
  DialogActions,
  DialogBody,
  DialogSurface,
  Dialog,
  DialogContent,
  DialogTitle,
  Toaster,
} from "@fluentui/react-components";
import { tableStyles } from "./tableStyles";
import type { ResourceDto } from "../../models/ResourceDto";
import ErrorBar from "../ErrorBar";
import { useState } from "react";
import handleError from "../../util/handleError";
import { deleteResource } from "../../services/projectService";
import { useNavigate } from "react-router";
import { useToast } from "../../hooks/ToasterLink";

interface ResourcesTableProps {
  resources: ResourceDto[];
  onEditResource: (resourceId: string) => void;
  projectId: string;
  controls: boolean;
}

export const ResourcesTable: React.FC<ResourcesTableProps> = ({
  resources = [],
  onEditResource,
  projectId,
  controls,
}) => {
  const styles = tableStyles();
  const navigate = useNavigate();
  const { notify, toasterId } = useToast();

  const [error, setError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [resourceItems, setResourceItems] = useState<ResourceDto[]>(resources);

  const columns: TableColumnDefinition<ResourceDto>[] = [
    createTableColumn<ResourceDto>({
      columnId: "fullName",
      compare: (a, b) => {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      },
    }),
    createTableColumn<ResourceDto>({
      columnId: "role",
      compare: (a, b) => {
        return a.role.localeCompare(b.role);
      },
    }),
    createTableColumn<ResourceDto>({
      columnId: "team",
      compare: (a, b) => {
        const teamA = (a.team || "").trim().toLowerCase();
        const teamB = (b.team || "").trim().toLowerCase();

        return teamA.localeCompare(teamB);
      },
    }),
  ];

  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures(
    {
      columns,
      items: resourceItems,
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

    deleteResource(projectId, selectedId)
      .then(() =>
        setResourceItems((prevResources) =>
          prevResources.filter((resource) => resource.id !== selectedId)
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
              Are you sure you want to delete this resource? This action cannot
              be undone.
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
            <TableHeaderCell {...headerSortProps("fullName")}>
              Full Name
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("role")}>Role</TableHeaderCell>
            <TableHeaderCell {...headerSortProps("team")}>Team</TableHeaderCell>
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
              <TableRow key={item.id}>
                <TableCell>
                  <TableCellLayout
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/projects/${projectId}/resources/${item.id}`)
                    }
                  >
                    {`${item.firstName} ${item.lastName}` || "N/A"}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{item.role}</TableCellLayout>
                </TableCell>
                <TableCell>{item.team}</TableCell>
                {controls && (
                  <>
                    <TableCell>
                      <TableCellLayout>
                        <Button
                          icon={<EditRegular />}
                          shape="circular"
                          onClick={() => onEditResource(item.id || "")}
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
              <TableCell>No resources</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
