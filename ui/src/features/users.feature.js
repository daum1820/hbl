import { createSlice } from '@reduxjs/toolkit'

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: {
      items: {},
      count: 0,
    },
    count: 0,
    error: {},
  },
  reducers: {
    list: (state, action) => {
      state.error = {};
      state.list = action.payload;
    },
    fetch: (state, action) => {
      const { _id:id } = action.payload;
      state.list.items[id] = action.payload;
      state.error = {}
    },
    remove: (state, action) => {
      delete state.list.items[action.payload];
      state.error = {};
    },
    count: (state, action) => {
      state.count = action.payload;
      state.error = {};
    },
    error: (state, action) => { 
      state.error = action.payload;
    }
  },
})

export const { fetch, list, remove, count, error  } = usersSlice.actions

export const getUserSelector = (userId) => (state) => state.users.list.items[userId];
export const getUserCounterSelector = (state) => state.users.count;
export const getUserListSelector = (state) => state.users.list;

export default usersSlice.reducer;
