import _ from 'lodash';
import API from 'lib/config';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetch, list, remove, dashboard, error } from 'features/invoices.feature';
import { sagaActions }from './actions.saga';
import { pushError, pushSuccess } from 'sagas';
import history from 'lib/history';

export function* saveInvoice({ payload }) {  
  try {
    const { id } = payload || {}
    const { data } = yield call(_.isEmpty(id) ? API.post : API.put, { url: _.isEmpty(id) ? '/invoices/create' : `/invoices/${id}`, data: payload });
    yield put(fetch(data));
    yield pushSuccess('readInvoice', { message: 'message.invoice.save.success'});

    yield history.push(`/invoices/${data._id}`);
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('saveInvoice', err);
  }
  
}

export function* listInvoices({ payload }) {  
  try {
    const { params } = payload || {}
    const response = yield call(API.get, { url: `/invoices`, config: { params } });
    yield put(list(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('listInvoices', err);
  }

}

export function* dashboardInvoices({ payload }) {  
  try {
    const { params } = payload || {}
    const { data:count } = yield call(API.get, { url: `/invoices/count`, config: { params } });
    const { data:amount } = yield call(API.get, { url: `/invoices/amount`, config: { params } });
    yield put(dashboard({ count, amount }));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('countInvoices', err);
  }

}

export function* readInvoice({ payload }) {  
  try {
    const { id } = payload || {}
    const response = yield call(API.get, { url: `/invoices/${id}` });
    yield put(fetch(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('readInvoice', err);
  }

}

export function* deleteInvoice({ payload }) {  
  try {
    const { id } = payload || {}
    yield call(API.delete, { url: `/invoices/${id}` });
    yield put(remove(id));
    yield pushSuccess('deleteInvoice', { message: 'message.invoice.remove.success'});
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deleteInvoice', err);
  }

}

export function* invoiceStatus({ payload }) {
  try {
    const { id, message, ...data } = payload;
    const response =  yield call(API.put, { url: `/invoices/${id}/changeStatus`, data });
    yield pushSuccess('invoiceStatus', { message });
    yield put(fetch(response.data));
  } catch (err) {
    yield pushError('invoiceStatus', err);
  }
}

export function* createItem({ payload, callback }) {
  try {
    const { id, ...data } = payload;
    const { data:invoice } = yield call(API.post, { url: `/invoices/${id}/item`, data });
    yield pushSuccess('createItem', { message: 'message.invoice.item.add.success'});
    yield put(fetch(invoice));
    yield callback();
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('createItem', err);
  }
}

export function* deleteItem({ payload }) {
  try {

    const { id:itemId, params: { id, ...rest}} = payload;
    
    const { data } = yield call(API.delete, { url: `/invoices/${id}/item`, config: { data: { _id: itemId, ...rest }}});
    yield pushSuccess('deleteItem', { message: 'message.invoice.item.remove.success'});
    yield put(fetch(data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deleteItem', err);
  }
}

export default function* watchInvoicesSaga() {
  yield takeEvery(sagaActions.DASHBOARD_INVOICES, dashboardInvoices)
  yield takeLatest(sagaActions.LIST_INVOICES, listInvoices)
  yield takeLatest(sagaActions.SAVE_INVOICE, saveInvoice)
  yield takeLatest(sagaActions.READ_INVOICE, readInvoice)
  yield takeLatest(sagaActions.DELETE_INVOICE, deleteInvoice)
  yield takeLatest(sagaActions.INVOICE_CHANGE_STATUS, invoiceStatus)
  yield takeLatest(sagaActions.INVOICE_ADD_ITEM, createItem)
  yield takeLatest(sagaActions.INVOICE_REMOVE_ITEM, deleteItem)
}