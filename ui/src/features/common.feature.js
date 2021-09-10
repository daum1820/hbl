import { createSlice } from '@reduxjs/toolkit';

export const commonSlice = createSlice({
  name: 'common',
  initialState: {
    loading: false,
    notifications: {},
    types: {}
  },
  reducers: {
    startLoading: (state) => {
        state.loading = true
    },
    stopLoading: (state) => { 
      state.loading = false
    },
    clearAll: (state) => {
      state.notifications = {}
    },
    clear: (state, action) => {
      delete state.notifications[action.payload];
    },
    push: (state, action) => {
      const {id} = action.payload;
      state.notifications[id] = action.payload; 
    },
    types: (state, action) => {
      const {type, data} = action.payload;
      state.types[type] = data;
    }
  },
})

export const { startLoading, stopLoading, clear, clearAll, push, types } = commonSlice.actions

export default commonSlice.reducer;

export const getTypeSelector = (type) => (state) => state.common.types[type] || [];