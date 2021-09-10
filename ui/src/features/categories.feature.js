import { createSlice, createSelector } from '@reduxjs/toolkit'

export const categoriesSlice = createSlice({
  name: 'categories',
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

export const { fetch, list, remove, count, error  } = categoriesSlice.actions

export const getCategorySelector = (categoryId) => (state) => state.categories.list.items[categoryId];
export const getCategoryCounterSelector = (categoryType) => (state) => state.categories.count[categoryType] || 0;
export const getCategoryListSelector = (state) => state.categories.list;

export const getCategoryTypeSelectorFactory = (categoryType) => createSelector(
  getCategoryListSelector,
  list => Object.values(list.items).filter( i => i.type === categoryType)
)

export default categoriesSlice.reducer;
