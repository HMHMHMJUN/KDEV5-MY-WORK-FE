import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";

/**
 * @param {{
 *   selectedEmployees: { id: string, name: string, email?: string }[],
 *   onRemove: (id: string) => void,
 *   onManagerChange: (emp: { id: string, name: string, email?: string, isManager: boolean }) => void
 * }} props
 */
export default function CompanyMemberList({ selectedEmployees, onRemove, onManagerChange }) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const handleManagerClick = (emp) => {
    setSelectedEmp(emp);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEmp(null);
  };

  const handleDialogConfirm = () => {
    if (onManagerChange && selectedEmp) {
      onManagerChange(selectedEmp);
    }
    setDialogOpen(false);
    setSelectedEmp(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 1.5,
      }}
    >
      {selectedEmployees.map((emp) => (
        <Box
          key={emp.id}
          sx={{
            minWidth: 300,
            maxWidth: 300,
            minHeight: 80,
            maxHeight: 80,
            flex: "1 0 120px",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.palette.background.paper,
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {emp.name}
              </Typography>
              {(emp.memberRole === "DEV_ADMIN" || emp.memberRole === "CLIENT_ADMIN") && (
                <Button
                  size="small"
                  variant="outlined"
                  color={emp.isManager ? "error" : "inherit"}
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.2,
                    fontSize: 12,
                    fontWeight: 700,
                    ml: 1,
                    borderColor: emp.isManager ? theme.palette.error.main : theme.palette.grey[400],
                    color: emp.isManager ? theme.palette.error.main : theme.palette.grey[400],
                    cursor: "pointer",
                    lineHeight: 1.2,
                    "&:hover": {
                      borderColor: emp.isManager ? theme.palette.error.dark : theme.palette.grey[600],
                      backgroundColor: emp.isManager ? theme.palette.error.light : theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleManagerClick(emp)}
                >
                  manager
                </Button>
              )}
            </Box>
            {emp.email && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {emp.email}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={() => onRemove(emp.id)}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <ConfirmDialog
        open={dialogOpen}
        title="매니저 권한 변경"
        description={selectedEmp?.isManager ? "매니저 등록을 해제 합니다." : "매니저 등록을 합니다."}
        confirmText="확인"
        cancelText="취소"
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </Box>
  );
}
