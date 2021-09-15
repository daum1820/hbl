import _ from 'lodash';
import API from 'lib/config';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetch, list, remove, count, error, removePrinter, addPrinter } from 'features/customers.feature';
import { sagaActions }from './actions.saga';
import { pushError, pushSuccess } from 'sagas';
import history from 'lib/history';

export function* saveCustomer({ payload }) {  
  try {
    const { id } = payload || {}
    const { data } = yield call(_.isEmpty(id) ? API.post : API.put, { url: _.isEmpty(id) ? '/customers/create' : `/customers/${id}`, data: payload });
    yield put(fetch(data));
    yield pushSuccess('readCustomer', { message: 'message.customer.save.success'});

    yield history.push(`/customers/${data._id}`); 
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('saveCustomer', err);
  }
  
}

export function* listCustomers({ payload }) {  
  try {
    const { params } = payload || {}
    const response = yield call(API.get, { url: `/customers`, config: { params } });
    yield put(list(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('listCustomers', err);
  }

}

export function* countCustomers({ payload }) {  
  try {
    const { params } = payload || {}
    const { data } = yield call(API.get, { url: `/customers/count`, config: { params } });
    yield put(count(data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('countCustomers', err);
  }

}

export function* readCustomer({ payload }) {  
  try {
    const { id } = payload || {}
    const response = yield call(API.get, { url: `/customers/${id}` });
    yield put(fetch(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('readCustomer', err);
  }

}

export function* deleteCustomer({ payload }) {  
  try {
    const { id } = payload || {}
    yield call(API.delete, { url: `/customers/${id}` });
    yield put(remove(id));
    yield pushSuccess('deleteCustomer', { message: 'message.customer.remove.success'});
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deleteCustomer', err);
  }

}

export function* customerStatus({ payload }) {
  try {
    const { id, message, ...data } = payload;
    const response =  yield call(API.put, { url: `/customers/${id}/changeStatus`, data });
    yield pushSuccess('customerStatus', { message });
    yield put(fetch(response.data));
  } catch (err) {
    yield pushError('customerStatus', err);
  }
}

export function* createPrinter({ payload, callback }) {
  try {
    const { id, ...data } = payload;
    const { data:printer } = yield call(API.post, { url: `/customers/${id}/printer`, data });
    yield pushSuccess('addPrinter', { message: 'message.customer.printer.add.success'});
    yield put(addPrinter({id, printer }));
    yield callback();
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('addPrinter', err);
  }
}

export function* deletePrinter({ payload }) {
  try {
    const { id:printerId, params: { id } } = payload;
    yield call(API.delete, { url: `/customers/${id}/printer`, config: { data: { _id: printerId }}});
    yield pushSuccess('deletePrinter', { message: 'message.customer.printer.remove.success'});
    yield put(removePrinter({id, printerId}));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deletePrinter', err);
  }
}

export default function* watchCustomersSaga() {
  yield takeEvery(sagaActions.COUNT_CUSTOMERS, countCustomers)
  yield takeLatest(sagaActions.LIST_CUSTOMERS, listCustomers)
  yield takeLatest(sagaActions.SAVE_CUSTOMER, saveCustomer)
  yield takeLatest(sagaActions.READ_CUSTOMER, readCustomer)
  yield takeLatest(sagaActions.DELETE_CUSTOMER, deleteCustomer)
  yield takeLatest(sagaActions.CUSTOMER_CHANGE_STATUS, customerStatus)
  yield takeLatest(sagaActions.CUSTOMER_DELETE_PRINTER, deletePrinter)
  yield takeLatest(sagaActions.CUSTOMER_ADD_PRINTER, createPrinter)
}