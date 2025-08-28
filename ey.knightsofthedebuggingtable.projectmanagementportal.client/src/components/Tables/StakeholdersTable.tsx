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
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Toaster,
} from "@fluentui/react-components";
import { tableStyles } from "./tableStyles";
import type { StakeholderDto } from "../../models/StakeholderDto";
import { useState, useEffect } from "react";
import type { UserDto } from "../../models/UserDto";
import { getUsers } from "../../services/userService";
import handleError from "../../util/handleError";
import ErrorBar from "../ErrorBar";
import { deleteStakeholder } from "../../services/stakeholderService";
import { useNavigate } from "react-router";
import { useToast } from "../../hooks/ToasterLink";

interface StakeholdersTableProps {
  stakeholders: StakeholderDto[];
  onEditStakeholder: (stakeholderId: string) => void;
  projectId: string;
  controls: boolean;
}

export const StakeholdersTable: React.FC<StakeholdersTableProps> = ({
  stakeholders,
  onEditStakeholder,
  projectId,
  controls,
}) => {
  const styles = tableStyles();
  const navigate = useNavigate();
  const { notify, toasterId } = useToast();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [error, setError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [stakeholdersItems, setStakeholdersItems] =
    useState<StakeholderDto[]>(stakeholders);

  const columns: TableColumnDefinition<StakeholderDto>[] = [
    createTableColumn<StakeholderDto>({
      columnId: "email",
      compare: (a, b) => {
        const descA = a.email || "";
        const descB = b.email || "";

        return descA.localeCompare(descB);
      },
    }),
    createTableColumn<StakeholderDto>({
      columnId: "role",
      compare: (a, b) => {
        return a.role.localeCompare(b.role);
      },
    }),
  ];

  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures(
    {
      columns,
      items: stakeholdersItems,
    },
    [
      useTableSort({
        defaultSortState: { sortColumn: "email", sortDirection: "ascending" },
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

  useEffect(() => {
    getUsers()
      .then((users) => setUsers(users))
      .catch((error) => handleError(error, setError));
  }, []);

  const handleDelete = () => {
    if (!selectedId) {
      return;
    }

    setIsDialogOpen(false);

    deleteStakeholder(projectId, selectedId)
      .then(() =>
        setStakeholdersItems((prevStakeholders) =>
          prevStakeholders.filter(
            (stakeholder) => stakeholder.id !== selectedId
          )
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
              Are you sure you want to delete this stakeholder? This action
              cannot be undone.
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
            <TableHeaderCell {...headerSortProps("email")}>
              Email
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("role")}>Role</TableHeaderCell>
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
                      navigate(`/projects/${projectId}/stakeholders/${item.id}`)
                    }
                  >
                    {users.find((x) => x.id === item.userId)?.email || "N/A"}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{item.role}</TableCellLayout>
                </TableCell>

                {controls && (
                  <>
                    <TableCell>
                      <TableCellLayout>
                        <Button
                          icon={<EditRegular />}
                          shape="circular"
                          onClick={() => onEditStakeholder(item.id || "")}
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
                          aria-label="Delete"
                          onClick={() => {
                            setSelectedId(item.id);
                            setIsDialogOpen(true);
                          }}
                        />
                      </TableCellLayout>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No stakeholders</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
