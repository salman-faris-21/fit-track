import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ---------------- FETCH TODAY LOGS ---------------- */
export const fetchTodayLogs = createAsyncThunk(
  "logs/fetchToday",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/logs/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        throw new Error("Session expired");
      }

      if (!res.ok) {
        throw new Error("Failed to fetch logs");
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------------- SAVE LOG ---------------- */
export const saveLog = createAsyncThunk(
  "logs/save",
  async ({ type, value }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, value }),
      });

      if (res.status === 401) {
        throw new Error("Session expired");
      }

      if (!res.ok) {
        throw new Error("Failed to save log");
      }

      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const fetchWeeklyLogs = createAsyncThunk(
  "logs/fetchWeekly",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/logs/week", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch weekly logs");

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------------- SLICE ---------------- */
const logsSlice = createSlice({
  name: "logs",
  initialState: {
    today: {
      workout: 0,
      sleep: 0,
      water: 0,
      calories: 0,
    },
    weekly: [], // ✅
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH TODAY */
      .addCase(fetchTodayLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
      })
      .addCase(fetchTodayLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SAVE */
      .addCase(saveLog.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveLog.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveLog.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      /* FETCH WEEKLY */
      .addCase(fetchWeeklyLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeeklyLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.weekly = action.payload;
      })
      .addCase(fetchWeeklyLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default logsSlice.reducer;
