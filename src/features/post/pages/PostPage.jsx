import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "@/features/post/postSlice";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomTable from "@/components/CustomTable/CustomTable";

const columns = [
  { key: "createdAt", label: "작성일", type: "date" },
  { key: "author", label: "작성자", type: "text" },
  { key: "taskName", label: "업무명", type: "text" },
  { key: "status", label: "상태", type: "status", filter: true , statusMap: {
    "진행중": {
      label: "진행중",
      key: "warning",
    },
    "완료": {
      label: "완료",
      key: "success",
    },
    "대기중": {
      label: "대기중",
      key: "info",
  }}},
  { key: "dueDate", label: "마감일", type: "date" },
];

export default function PostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: posts } = useSelector((state) => state.post);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);


  const enrichedPosts = Array.isArray(posts) ? posts.map((post) => ({
    ...post,
    createdAt: post.createdAt,
    author: post.author,
    taskName: post.taskName,
    status: post.status,
    dueDate: post.dueDate,
    link: `/posts/${post.id}`,
  })) : [];

  const filtered = enrichedPosts.filter((post) =>
    post.taskName?.toLowerCase().includes(searchText.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        borderRadius: 4,
      }}
    >
      {/* 상단 헤더 영역 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={3}
      >
        <Box>
          <Typography variant="h3" fontWeight={600}>
            게시글
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            총 {filtered.length}개의 게시글이 있습니다.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ minWidth: 140 }}
          onClick={() => navigate("/posts/new")}
        >
          게시글 작성
        </Button>
      </Box>

      {/* 테이블 영역 */}
      <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, pb: 3 }}>
        <CustomTable
          columns={columns}
          rows={paginated}
          onRowClick={(row) => navigate(`/posts/${row.id}`)}
          pagination={{
            page,
            size: pageSize,
            total: filtered.length,
            onPageChange: setPage,
          }}
          search={{
            key: "taskName",
            placeholder: "업무명을 검색하세요",
            value: searchText,
            onChange: setSearchText,
          }}
        />
      </Box>
    </Box>
  );
}
