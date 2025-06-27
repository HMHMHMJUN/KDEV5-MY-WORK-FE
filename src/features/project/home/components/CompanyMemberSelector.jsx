import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProjectMemberList,
  addMemberToProject,
  removeMemberFromProject,
  fetchCompanyMembersInProject,
} from "@/features/project/slices/projectMemberSlice";
import {
  Autocomplete,
  Box,
  Avatar,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import CompanyMemberList from "./CompanyMemberList";
import { updateProjectManager } from "@/api/projectMember";
/**
 * @param {string} companyId
 * @param {'고객사'|'개발사'} companyType
 */
export default function CompanyMemberSelector({
  companyId,
  companyType = "개발사",
}) {
  const theme = useMuiTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (companyId && projectId) {
      dispatch(fetchCompanyMembersInProject({ projectId, companyId })).then(
        (action) => {
          if (Array.isArray(action.payload)) {
            setAssigned(action.payload);
          } else if (action.payload?.members) {
            setAssigned(action.payload.members);
          }
        }
      );
    }
  }, [companyId, projectId, dispatch]);

  const handleOpen = () => {
    setOpen(true);
    if (companyId && projectId) {
      setLoading(true);
      dispatch(fetchProjectMemberList({ companyId, projectId }))
        .then((action) => {
          if (Array.isArray(action.payload)) {
            setOptions(action.payload);
          } else if (action.payload?.members) {
            setOptions(action.payload.members);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const handleChange = (_e, newValue) => {
    const additions = newValue.filter(
      (nv) => !assigned.some((a) => a.memberId === nv.memberId)
    );
    additions.forEach((emp) => {
      dispatch(addMemberToProject({ projectId, memberId: emp.memberId }));
    });
    setAssigned(newValue);
    setOpen(false);
  };

  const handleRemove = (memberId) => {
    dispatch(removeMemberFromProject({ projectId, memberId }));
    setAssigned((prev) => prev.filter((emp) => emp.memberId !== memberId));
  };

  const getInitial = (name) => (name && name.length ? name[0] : "?");

  // 매니저 등록/해제 API 호출 함수
  const onManagerChange = async (emp) => {
    if (!projectId || !emp.id) return;
    try {
      await updateProjectManager(emp.id, projectId);
      // 성공 시 멤버 목록 새로고침
      if (companyId && projectId) {
        dispatch(fetchCompanyMembersInProject({ projectId, companyId })).then(
          (action) => {
            if (Array.isArray(action.payload)) {
              setAssigned(action.payload);
            } else if (action.payload?.members) {
              setAssigned(action.payload.members);
            }
          }
        );
      }
    } catch (e) {
      alert("매니저 등록/해제에 실패했습니다.");
    }
  };

  return (
    <Box>
      <Autocomplete
        multiple
        open={open}
        onOpen={handleOpen}
        disableClearable
        clearIcon={null}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        getOptionLabel={(opt) => opt.memberName}
        isOptionEqualToValue={(opt, val) => opt.memberId === val.memberId}
        value={assigned}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_, newInput) => setInputValue(newInput)}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;
          return (
            <Box
              component="li"
              key={key}
              {...rest}
              sx={{ display: "flex", alignItems: "center", py: 0.5 }}
            >
              <Avatar sx={{ width: 30, height: 30, mr: 1 }}>
                {getInitial(option.memberName)}
              </Avatar>
              <Typography sx={{ flexGrow: 1 }}>{option.memberName}</Typography>
              {selected && (
                <Typography variant="caption" color="primary">
                  선택됨
                </Typography>
              )}
            </Box>
          );
        }}
        renderTags={() => null}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`${companyType} 직원 이름 검색`}
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={20} />}
                  {inputValue && (
                    <IconButton size="small" onClick={() => setInputValue("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{
          width: { xs: "100%", sm: 360 },
          "& .MuiOutlinedInput-root": {
            bgcolor: theme.palette.background.paper,
          },
        }}
      />

      <Box sx={{ mt: 2 }}>
        <CompanyMemberList
          selectedEmployees={assigned.map((emp) => ({
            id: emp.memberId,
            name: emp.memberName,
            email: emp.email,
            memberRole: emp.memberRole,
            isManager: emp.isManager,
          }))}
          onRemove={handleRemove}
          onManagerChange={onManagerChange}
        />
      </Box>
    </Box>
  );
}
