import { createSlice } from '@reduxjs/toolkit';

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: {
      items: {},
      count: 0,
    },
    count: {},
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
    dashboard: (state, action) => {
      const { count, context } = action.payload;
      state.count[context] = count;
      state.error = {};
    },
    error: (state, action) => { 
      state.error = action.payload;
    }
  },
})

export const { fetch, list, remove, dashboard, error  } = ordersSlice.actions

export const getOrderSelector = (orderId) => (state) => state.orders.list.items[orderId];
export const getOrderCounterSelector =  (context) => (state) => state.orders.count[context] || 0;
export const getOrderListSelector = (state) => state.orders.list;

export default ordersSlice.reducer;
