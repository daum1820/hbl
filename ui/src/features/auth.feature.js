import { createSlice } from '@reduxjs/toolkit'
import { hasToken } from 'lib/token'
import { getToken, parseToken } from 'lib/token'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    auth: hasToken(),
    authUser: parseToken(getToken()),
    error: {},
  },
  reducers: {
    login: (state, action) => {
        state.authUser = action.payload
        state.auth = true
        state.error = {}
    },
    logout: (state) => { 
        state.auth = false
        state.authUser = {}
        state.error = {}
    },
    error: (state, action) => { 
        state.auth = false
        state.authUser = {}
        state.error = action.payload;
    }
  },
})

export const { login, logout, error } = authSlice.actions

export default authSlice.reducer;

