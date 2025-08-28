import * as React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
} from "@fluentui/react-components";
import { tableStyles } from "./tableStyles";
import type { AdvanceRequestDto } from "../../models/AdvanceRequestDto";
import type { StageDto } from "../../models/StageDto";

interface AdvanceRequestTableProps {
  requests: AdvanceRequestDto[];
  stages: StageDto[];
}

interface AdvanceRequestTableRow {
  id: string;
  projectName: string;
  currentStageName: string;
  nextStageName?: string;
  requestedAt: Date;
  status: string;
}

export const AdvanceRequestTable: React.FC<AdvanceRequestTableProps> = ({
  requests,
  stages,
}) => {
  const styles = tableStyles();

  const tableRows: AdvanceRequestTableRow[] = requests.map((r) => {
    const currentStage = stages.find((s) => s.id == r.currentStageId);
    const nextStage = stages.find((s) => s.id == r.nextStageId);

    return {
      id: r.id!,
      projectName: r.project.name,
      currentStageName: currentStage!.name,
      nextStageName: nextStage?.name,
      requestedAt: r.requestedAt,
      status: r.status,
    };
  });

  return (
    <div className={styles.tableContainer}>
      <Table
        className={styles.table}
        sortable
        aria-label="Table with sort"
        style={{ minWidth: "500px" }}
      >
        <TableHeader>
          <TableRow className={styles.tableHeader}>
            <TableHeaderCell>Project</TableHeaderCell>
            <TableHeaderCell>Current Stage</TableHeaderCell>
            <TableHeaderCell>Next Stage</TableHeaderCell>
            <TableHeaderCell>Requested At</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows.length > 0 ? (
            tableRows.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <TableCellLayout>{request.projectName}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{request.currentStageName}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{request.nextStageName}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>
                    {`${request.requestedAt.toDateString()} at ${request.requestedAt.toLocaleTimeString()}`}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{request.status}</TableCellLayout>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No advance requests</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
