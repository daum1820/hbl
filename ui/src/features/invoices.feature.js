import { createSlice, createSelector } from '@reduxjs/toolkit';

export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: {
    list: {
      items: {},
      amount: 0,
      count: 0,
    },
    count: 0,
    amount: 0,
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
      const { count, amount } = action.payload;
      state.count = count;
      state.amount = amount;
      state.error = {};
    },
    error: (state, action) => { 
      state.error = action.payload;
    }
  },
})

export const { fetch, list, remove, dashboard, error  } = invoicesSlice.actions

export const getInvoiceSelector = (invoiceId) => (state) => state.invoices.list.items[invoiceId];
export const getInvoiceCounterSelector =  (state) => state.invoices.count || 0;
export const getInvoiceAmountSelector =  (state) => state.invoices.amount || 0;
export const getInvoiceListSelector = (state) => state.invoices.list;
export const getInvoiceItemSelectorFactory = (invoiceId) => createSelector(
  getInvoiceSelector(invoiceId),
  invoice => ({ items: invoice?.items || {}, count: !!invoice ? Object.keys(invoice?.items).length : 0})
);

export default invoicesSlice.reducer;
