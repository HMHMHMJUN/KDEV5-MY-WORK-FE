// post Redux slice
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as postAPI from "@/api/post";

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const response = await postAPI.getPosts();
      console.log('response', response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "post/fetchPostById",
  async (id, thunkAPI) => {
    try {
      const response = await postAPI.getPostById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, thunkAPI) => {
    try {
      const response = await postAPI.createPost(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await postAPI.updatePost(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id, thunkAPI) => {
    try {
      await postAPI.deletePost(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    data: [],
    current: null,
  },
  reducers: {
    clearCurrentPost(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 목록 조회
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      // 상세 조회
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.current = action.payload;
      })

      // 생성
      .addCase(createPost.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // 수정
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.data.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })

      // 삭제
      .addCase(deletePost.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;