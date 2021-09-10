import { all, put } from 'redux-saga/effects'
import watchAuthSaga from './auth.saga';
import { watchNotificationSaga, watchTypeSaga } from './common.saga';
import watchUsersSaga from './users.saga';
import { sagaActions }from './actions.saga';
import watchCategoriesSaga from './categories.saga';
import watchProductsSaga from './products.saga';
import watchCustomersSaga from './customers.saga';
import watchInvoicesSaga from './invoices.saga';
import watchOrdersSaga from './orders.saga';

export * from './actions.saga';

export default function* rootSaga() {
  yield all([
    watchAuthSaga(),
    watchNotificationSaga(),
    watchTypeSaga(),
    watchUsersSaga(),
    watchCategoriesSaga(),
    watchProductsSaga(),
    watchCustomersSaga(),
    watchInvoicesSaga(),
    watchOrdersSaga(),
  ])
}

export function* pushInfo(context, payload) {
  console.log(`>>> ${context}`, payload);
  yield put({ type: sagaActions.PUSH_INFO_NOTIFICATION , payload });
}

export function* pushSuccess(context, payload) {
  console.log(`>>> ${context}`, payload);
  yield put({ type: sagaActions.PUSH_SUCCESS_NOTIFICATION , payload });
}

export function* pushError(context, err) {
  console.error(`>>> ${context}`, err);
  const { response: { data }} = err;
  
  if (!!data && !!data.key)
    yield put({ type: sagaActions.PUSH_ERROR_NOTIFICATION , payload: { message: data.key, params: data.params }});
}