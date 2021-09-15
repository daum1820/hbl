import _ from 'lodash';
import API from 'lib/config';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetch, list, remove, dashboard, error } from 'features/orders.feature';
import { sagaActions }from './actions.saga';
import { pushError, pushSuccess } from 'sagas';
import history from 'lib/history';

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

export default function* watchOrdersSaga() {
  yield takeEvery(sagaActions.DASHBOARD_ORDERS, dashboardOrders)
  yield takeLatest(sagaActions.LIST_ORDERS, listOrders)
  yield takeLatest(sagaActions.SAVE_ORDER, saveOrder)
  yield takeLatest(sagaActions.READ_ORDER, readOrder)
  yield takeLatest(sagaActions.DELETE_ORDER, deleteOrder)
  yield takeLatest(sagaActions.ORDER_CHANGE_STATUS, orderStatus)
}