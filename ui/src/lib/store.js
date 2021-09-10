import { configureStore, } from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import logger from 'redux-logger';
import authReducer from 'features/auth.feature'; 
import commonReducer from 'features/common.feature';
import usersReducer from 'features/users.feature'; 
import categoriesReducer from 'features/categories.feature'; 
import productsReducer from 'features/products.feature'; 
import customersReducer from 'features/customers.feature'; 
import invoicesReducer from 'features/invoices.feature'; 
import ordersReducer from 'features/orders.feature'; 

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware()
const middleware = [logger, sagaMiddleware];

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    users: usersReducer,
    categories: categoriesReducer,
    products: productsReducer,
    customers: customersReducer,
    invoices: invoicesReducer,
    orders: ordersReducer,
  },
  middleware
});

sagaMiddleware.run(rootSaga);

export default appStore;