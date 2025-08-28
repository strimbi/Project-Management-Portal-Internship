import {
  Button,
  createTableColumn,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  useTableFeatures,
  useTableSort,
  type TableColumnDefinition,
  type TableColumnId,
} from "@fluentui/react-components";
import { Share20Filled } from "@fluentui/react-icons";
import type { ProjectDto } from "../../models/ProjectDto";
import { Link } from "react-router";
import { tableStyles } from "./tableStyles";

interface ProjectsTableProps {
  projects: ProjectDto[];
  filter: boolean;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, filter }) => {
  const styles = tableStyles();

  const columns: TableColumnDefinition<ProjectDto>[] = [
    createTableColumn<ProjectDto>({
      columnId: "name",
      compare: (a, b) => {
        return a.name.localeCompare(b.name);
      },
    }),
    createTableColumn<ProjectDto>({
      columnId: "description",
      compare: (a, b) => {
        const descA = a.description || "";
        const descB = b.description || "";

        return descA.localeCompare(descB);
      },
    }),
    createTableColumn<ProjectDto>({
      columnId: "startDate",
      compare: (a, b) => {
        return a.startDate.getTime() - b.startDate.getTime();
      },
    }),
    createTableColumn<ProjectDto>({
      columnId: "endDate",
      compare: (a, b) => {
        const timeA = a.endDate ? a.endDate.getTime() : 0;
        const timeB = b.endDate ? b.endDate.getTime() : 0;

        return timeA - timeB;
      },
    }),
  ];

  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures<ProjectDto>(
    {
      columns,
      items: projects,
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

  return (
    <div className={styles.tableContainer}>
      <Table sortable aria-label="Table with sort" className={styles.table}>
        <TableHeader className={styles.tableHeader}>
          <TableRow className={styles.tableRow}>
            <TableHeaderCell
              className={styles.moreButtonContainer}
            ></TableHeaderCell>
            <TableHeaderCell {...headerSortProps("name")}>
              <b>Name</b>
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("description")}>
              <b>Description</b>
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("startDate")}>
              <b>Start Date</b>
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("endDate")}>
              <b>End Date</b>
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((project) => (
              <TableRow key={project.item.id} className={styles.tableRow}>
                <TableCell className={styles.moreButtonContainer}>
                  <Link to={{ pathname: `/projects/${project.item.id}` }}>
                    <Button
                      className={styles.addButton}
                      shape="circular"
                      icon={<Share20Filled />}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <TableCellLayout className={styles.textOverflow}>
                    {project.item.name}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout className={styles.textOverflow}>
                    {project.item.description}
                  </TableCellLayout>
                </TableCell>
                <TableCell>{project.item.startDate.toDateString()}</TableCell>
                <TableCell>
                  <TableCellLayout>
                    {project.item.endDate
                      ? project.item.endDate.toDateString()
                      : "N/A"}
                  </TableCellLayout>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                {filter ? "No projects matching criteria" : "No projects"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
