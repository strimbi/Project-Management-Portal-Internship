import * as React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
  Button,
} from "@fluentui/react-components";
import { tableStyles } from "./tableStyles";
import type { ApprovalDto } from "../../models/ApprovalDto";
import { CheckmarkFilled, DismissFilled } from "@fluentui/react-icons";

interface ApprovalTableProps {
  approvals: ApprovalDto[];
  controls: boolean;
  onApprove: (approvalId: string) => void;
  onReject: (approvalId: string) => void;
}

export const ApprovalTable: React.FC<ApprovalTableProps> = ({
  approvals,
  controls,
  onApprove,
  onReject,
}) => {
  const styles = tableStyles();

  return (
    <div className={styles.tableContainer}>
      <Table className={styles.table} sortable style={{ minWidth: "500px" }}>
        <TableHeader>
          <TableRow className={styles.tableHeader}>
            <TableHeaderCell>Project</TableHeaderCell>
            <TableHeaderCell>Current Stage</TableHeaderCell>
            <TableHeaderCell>Next Stage</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            {!controls && <TableHeaderCell>Approved At</TableHeaderCell>}
            {controls && (
              <TableHeaderCell
                className={styles.moreButtonContainer}
              ></TableHeaderCell>
            )}
            {controls && (
              <TableHeaderCell
                className={styles.moreButtonContainer}
              ></TableHeaderCell>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.length > 0 ? (
            approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <TableCellLayout>{approval.projectName}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{approval.currentStageName}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{approval.nextStageName}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{approval.status}</TableCellLayout>
                </TableCell>
                {!controls && (
                  <TableCell>
                    <TableCellLayout>
                      {approval.approvedAt
                        ? approval.approvedAt.toDateString()
                        : "N/A"}
                    </TableCellLayout>
                  </TableCell>
                )}
                {controls && (
                  <TableCell>
                    <TableCellLayout>
                      <Button
                        icon={<CheckmarkFilled />}
                        shape="circular"
                        onClick={() => onApprove(approval.id!)}
                        className={styles.approveButton}
                        aria-label="Edit"
                      />
                    </TableCellLayout>
                  </TableCell>
                )}
                {controls && (
                  <TableCell>
                    <TableCellLayout>
                      <Button
                        icon={<DismissFilled />}
                        shape="circular"
                        className={styles.deleteButton}
                        onClick={() => onReject(approval.id!)}
                        aria-label="Delete"
                      />
                    </TableCellLayout>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No approvals</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
