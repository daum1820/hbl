import { createSlice } from '@reduxjs/toolkit'

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: {
      items: {},
      count: 0,
    },
    selected: {},
    count: {},
    error: {},
  },
  reducers: {
    list: (state, action) => {
      state.error = {};
      state.list = action.payload;
    },
    fetch: (state, action) => {
      state.selected = action.payload;
      state.error = {};
      state.list = {
        items: {},
        count: 0,
      }
    },
    remove: (state, action) => {
      delete state.list.items[action.payload];
      state.error = {};
    },
    count: (state, action) => {
      const { type, count } = action.payload;
      state.count[type] = count;
      state.error = {};
    },
    error: (state, action) => { 
      state.error = action.payload;
    }
  },
})

export const { fetch, list, remove, count, error  } = productsSlice.actions

export const getProductSelector = (state) => state.products.selected;
export const getProductCounterSelector = (productType) => (state) => state.products.count[productType] || 0;
export const getProductListSelector = (state) => state.products.list;

export default productsSlice.reducer;
