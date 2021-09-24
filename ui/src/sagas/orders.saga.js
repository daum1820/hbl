import _ from 'lodash';
import API from 'lib/config';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetch, list, remove, dashboard, error } from 'features/orders.feature';
import { sagaActions }from './actions.saga';
import { pushError, pushSuccess } from 'sagas';
import history from 'lib/history';
import { delay } from './common.saga';

export function* saveOrder({ payload }) {  
  try {
    const { id } = payload || {}
    const { data } = yield call(_.isEmpty(id) ? API.post : API.put, { url: _.isEmpty(id) ? '/orders/create' : `/orders/${id}`, data: payload });
    yield put(fetch(data));
    yield pushSuccess('readOrder', { message: 'message.order.save.success'});

    yield history.push(`/orders/${data._id}`);
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('saveOrder', err);
  }
  
}

export function* listOrders({ payload }) {  
  try {
    const { params } = payload || {}
    const response = yield call(API.get, { url: `/orders`, config: { params } });
    yield put(list(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('listOrders', err);
  }

}

export function* dashboardOrders({ payload }) {  
  try {
    const { params, context } = payload || {}
    const { data:count } = yield call(API.get, { url: `/orders/count`, config: { params } });
    yield put(dashboard({ count, context }));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('countOrders', err);
  }

}

export function* readOrder({ payload }) {  
  try {
    const { id } = payload || {}
    const response = yield call(API.get, { url: `/orders/${id}` });
    yield put(fetch(response.data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('readOrder', err);
  }

}

export function* deleteOrder({ payload }) {  
  try {
    const { id } = payload || {}
    yield call(API.delete, { url: `/orders/${id}` });
    yield put(remove(id));
    yield pushSuccess('deleteOrder', { message: 'message.order.remove.success'});
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deleteOrder', err);
  }

}

export function* orderStatus({ payload }) {
  try {
    const { id, message, ...data } = payload;
    const response =  yield call(API.put, { url: `/orders/${id}/changeStatus`, data });
    yield pushSuccess('orderStatus', { message });
    yield put(fetch(response.data));
  } catch (err) {
    yield pushError('orderStatus', err);
  }
}

export function* closeOrder({ payload }) {
  try {
    const { id, message } = payload;
    const response =  yield call(API.put, { url: `/orders/${id}/close` });
    yield pushSuccess('closeOrder', { message });
    yield put(fetch(response.data));
  } catch (err) {
    yield pushError('closeOrder', err);
  }
}

export function* approveOrder({ payload, callback }) {
  try {
    const { id, ...payloadData } = payload;
    const { data } = yield call(API.put, { url: `/orders/${id}/approve`, data: payloadData });
    yield put(fetch(data));
    yield pushSuccess('approveOrder', { message: 'message.order.approve.success'});
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('approveOrder', err);
  }

  yield delay(200);
  yield callback();
}


export function* createItem({ payload }) {
  try {
    const { id, ...data } = payload;
    const { data:order } = yield call(API.post, { url: `/orders/${id}/item`, data });
    yield pushSuccess('createItem', { message: 'message.order.item.add.success'});
    yield put(fetch(order));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('createItem', err);
  }
}

export function* updateItem({ payload }) {
  try {
    const { id, ...data } = payload;
    const { data:order } = yield call(API.put, { url: `/orders/${id}/item`, data });
    yield put(fetch(order));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('updateItem', err);
  }
}

export function* deleteItem({ payload }) {
  try {

    const { id, itemOrder } = payload;
    
    const { data } = yield call(API.delete, { url: `/orders/${id}/item`, config: { data: {...itemOrder }}});
    yield pushSuccess('deleteItem', { message: 'message.order.item.remove.success'});
    yield put(fetch(data));
  } catch (err) {
    yield put(error(err?.response?.data));
    yield pushError('deleteItem', err);
  }
}

export default function* watchOrdersSaga() {
  yield takeEvery(sagaActions.DASHBOARD_ORDERS, dashboardOrders)
  yield takeLatest(sagaActions.LIST_ORDERS, listOrders)
  yield takeLatest(sagaActions.SAVE_ORDER, saveOrder)
  yield takeLatest(sagaActions.READ_ORDER, readOrder)
  yield takeLatest(sagaActions.DELETE_ORDER, deleteOrder)
  yield takeLatest(sagaActions.ORDER_CHANGE_STATUS, orderStatus)
  yield takeLatest(sagaActions.ORDER_ADD_ITEM, createItem)
  yield takeLatest(sagaActions.ORDER_REMOVE_ITEM, deleteItem)
  yield takeLatest(sagaActions.ORDER_UPDATE_ITEM, updateItem)
  yield takeLatest(sagaActions.ORDER_CLOSE, closeOrder)
  yield takeLatest(sagaActions.ORDER_APPROVE, approveOrder)
}