import {
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
import { tableStyles } from "./tableStyles";
import type { TemplateDto } from "../../models/TemplateDto";

interface TemplatesTableProps {
  templates: TemplateDto[];
}

const ProjectsTable: React.FC<TemplatesTableProps> = ({ templates }) => {
  const styles = tableStyles();

  const columns: TableColumnDefinition<TemplateDto>[] = [
    createTableColumn<TemplateDto>({
      columnId: "name",
      compare: (a, b) => {
        return a.name.localeCompare(b.name);
      },
    }),
    createTableColumn<TemplateDto>({
      columnId: "description",
      compare: (a, b) => {
        const descA = a.description || "";
        const descB = b.description || "";

        return descA.localeCompare(descB);
      },
    }),
    createTableColumn<TemplateDto>({
      columnId: "stages",
      compare: (a, b) => {
        const stagesA = a.stages || [];
        const stagesB = b.stages || [];

        return stagesA.length - stagesB.length;
      },
    }),
  ];

  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures<TemplateDto>(
    {
      columns,
      items: templates,
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
        <TableHeader>
          <TableRow className={styles.tableHeader}>
            <TableHeaderCell {...headerSortProps("name")}>
              <b>Name</b>
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("description")}>
              <b>Description</b>
            </TableHeaderCell>
            <TableHeaderCell {...headerSortProps("stages")}>
              <b>Stages</b>
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((template) => (
              <TableRow key={template.item.id} className={styles.tableRow}>
                <TableCell>
                  <TableCellLayout className={styles.textOverflow}>
                    {template.item.name}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout className={styles.textOverflow}>
                    {template.item.description}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  {template.item.stages?.map((s) => s.name).join(", ")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell></TableCell>
              <TableCell>No templates</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
