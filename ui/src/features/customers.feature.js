import { createSelector, createSlice } from '@reduxjs/toolkit'

export const customersSlice = createSlice({
  name: 'customers',
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
    },
    addPrinter: (state, action) => {
      const { id, printer } = action.payload;
      state.error = {};
      state.list.items[id].printers = {
        ...state.list.items[id].printers,
        [printer._id]: printer
      };
    },
    removePrinter: (state, action) => {
      const { id, printerId } = action.payload;
      delete state.list.items[id].printers[printerId];
      state.error = {};
    }
  },
})

export const { fetch, list, remove, count, error, removePrinter, addPrinter  } = customersSlice.actions

export const getCustomerSelector = (customerId) => (state) => state.customers.list.items[customerId];
export const getCustomerCounterSelector = (state) => state.customers.count || 0;
export const getCustomerListSelector = (state) => state.customers.list;
export const getCustomerPrintersSelectorFactory = (customerId) => createSelector(
  getCustomerSelector(customerId),
  customer => ({ items: customer?.printers || {}, count: !!customer ? Object.keys(customer?.printers).length : 0})
);
export default customersSlice.reducer;
