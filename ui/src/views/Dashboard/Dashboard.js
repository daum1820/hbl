import React from 'react';
import PersonAddIcon from '@material-ui/icons/PersonAddRounded';
import PeopleIcon from '@material-ui/icons/PeopleAltRounded';
import StoreIcon from '@material-ui/icons/Store';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import { sagaActions }from 'sagas/actions.saga';
import { useSelector } from 'react-redux';
import dashboardRoutes from 'routes';
import { useRouteMatch, Switch } from 'react-router-dom';
import { useQuery } from 'utils';
import { getUserCounterSelector } from 'features/users.feature';
import CommonList from 'components/Common/CommonList';
import DashboardItem from './DashboardItem';
import CategoryIcon from '@material-ui/icons/Category';
import PrintIcon from '@material-ui/icons/Print';
import { getCategoryCounterSelector } from 'features/categories.feature';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from 'routes/ProtectedRoute';
import { DisplayWhen } from 'utils/auth.utils';
import { hasRole } from 'utils/auth.utils';
import { getProductCounterSelector } from 'features/products.feature';
import { getCustomerCounterSelector } from 'features/customers.feature';
import { Receipt } from '@material-ui/icons';
import { getInvoiceCounterSelector } from 'features/invoices.feature';
import { getInvoiceAmountSelector } from 'features/invoices.feature';
import InvoiceCreate from 'views/Invoices/InvoiceCreate';
import Success from 'components/Typography/Success';
import Danger from 'components/Typography/Danger';
import { formatCurrency } from 'utils';
import { getOrderCounterSelector } from 'features/orders.feature';
import OrderCreate from 'views/Orders/OrderCreate';
import { readFromToken } from 'lib/token';


export default function Dashboard() {
  const countActiveUsers = useSelector(getUserCounterSelector);
  const countCategoryProblemSelector = useSelector(getCategoryCounterSelector('problem'));
  const countCategoryBrandSelector = useSelector(getCategoryCounterSelector('brand'));
  const countProductPrinterSelector = useSelector(getProductCounterSelector('printer'));
  const countProductServiceSelector = useSelector(getProductCounterSelector('service'));
  const countCustomerActiveSelector = useSelector(getCustomerCounterSelector);
  const countInvoicesOpenSelector = useSelector(getInvoiceCounterSelector);
  const amountInvoicesSelector = useSelector(getInvoiceAmountSelector);
  const countOrderOpenSelector = useSelector(getOrderCounterSelector('open'));
  const countMyOrdersOpenSelector = useSelector(getOrderCounterSelector('myOrders'));

  const { path } = useRouteMatch();
  const query = useQuery();
  const { t } = useTranslation();

  const userId = readFromToken('_id');

  const buidRoutes = (filterPath) => (
    <Switch>
    {dashboardRoutes.filter(dr => dr.dashboard() && filterPath(dr)).map((prop, key) => {
        const { path:propPath, name, icon, ...rest } = prop;
        return (
          <ProtectedRoute
            path={`${path}${propPath}`}
            key={key}>
              <CommonList filter={Object.fromEntries(query)} path={propPath} limit={5} {...rest} create={() => false}  />
          </ProtectedRoute>
        );
    })}
  </Switch>
  )

  const dashboardSwitchRoutes  = buidRoutes((item) => !item.path.includes('invoices') && !item.path.includes('orders'));
  const dashboardInvoiceSwitchRoutes  = buidRoutes((item) => item.path.includes('invoices'));
  const dashboardOrderSwitchRoutes  = buidRoutes((item) => item.path.includes('orders') );

  const [baseMd, baseItemMd, direction] = hasRole(['Admin', 'Moderator']) ? [4, 12, 'column'] : [12, 6, 'row'];

  return (
    <div>
      <GridContainer>
        <DisplayWhen roles={['Admin']}>
          <GridItem xs={12} sm={6} md={4}>            
            <InvoiceCreate
              color='danger'/>
          </GridItem> 
        </DisplayWhen>
        <DisplayWhen roles={['Admin', 'Moderator']}>
          <GridItem xs={12} sm={6} md={4}>            
            <OrderCreate
              color='warning'/>
          </GridItem> 
        </DisplayWhen>
        <GridItem xs={12} sm={12} md={baseMd}>
          <GridContainer direction={direction}>
            <DisplayWhen roles={['Admin']}>
              <GridItem xs={12} sm={12} md={12}>            
                <DashboardItem
                  onLoad={{ type: sagaActions.DASHBOARD_INVOICES, payload: { params: { status: 'open' }}}}
                  color='danger'
                  icon={Receipt}
                  highlights={[
                    {title: t('label.invoice.open'), value : countInvoicesOpenSelector},
                    {title: t('label.invoice.cash'), value : formatCurrency(amountInvoicesSelector), Component: amountInvoicesSelector >= 0 ? Success : Danger }
                  ]}
                  context='invoices'
                  listFilter={{ status:  'open' }}
                  view={() => false}
                  add={() => false }/>
              </GridItem>
            </DisplayWhen>
            <DisplayWhen roles={['User']}>
              <GridItem xs={12} sm={12} md={6}> 
                <DashboardItem
                  onLoad={{ type: sagaActions.DASHBOARD_ORDERS, payload: { context: 'myOrders', params: { status: ['open', 'wip'], technicalUser: userId }}}}
                  color='warning'
                  icon="manage_accounts"
                  highlights={[
                    {title: t('label.my.orders'), value : countMyOrdersOpenSelector}
                  ]}
                  context='orders'
                  listFilter={{ status: 'open,wip', technicalUser: userId }}
                  view={() => false}
                  add={() => false}/>
              </GridItem>
            </DisplayWhen>
            <GridItem xs={12} sm={12} md={baseItemMd}> 
              <DashboardItem
                onLoad={{ type: sagaActions.DASHBOARD_ORDERS, payload: { context: 'open', params: { status: ['open', 'wip'] }}}}
                color='warning'
                icon="engineering"
                highlights={[
                  {title: t('label.order.open'), value : countOrderOpenSelector},
                ]}
                context='orders'
                listFilter={{ status: 'open,wip'}}
                view={() => false}
                add={() => false }/>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <DisplayWhen roles={['Admin']}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {dashboardInvoiceSwitchRoutes}
          </GridItem>
        </GridContainer>
      </DisplayWhen>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          {dashboardOrderSwitchRoutes}
        </GridItem>
      </GridContainer>
      <DisplayWhen roles={['Admin', 'Moderator']}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>            
            <DashboardItem
              onLoad={{ type: sagaActions.COUNT_PRODUCTS, payload: { type: 'service', params: { type: 'Service' }}}}
              color='success'
              icon={PrintIcon}
              title={`${t('label.services')}`}
              context='products'
              value={countProductServiceSelector}
              listFilter={{ type:  'Service' }}
              view={() => false}
              add={() => hasRole(['Admin'])}/>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>            
            <DashboardItem
              onLoad={{ type: sagaActions.COUNT_CATEGORIES, payload: { type: 'brand', params: { type: 'Brand' }}}}
              color='rose'
              icon={CategoryIcon}
              title={`${t('label.category.text')}: ${t('label.category.type.brand')}`}
              context='categories'
              value={countCategoryBrandSelector}
              listFilter={{ type:  'Brand' }}
              view={() => false}
              add={() => hasRole(['Admin'])}/>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>            
            <DashboardItem
              onLoad={{ type: sagaActions.COUNT_CUSTOMERS, payload: { params: { status: 'active' }}}}
              color='primary'
              icon={StoreIcon}
              title={`${t('label.customers.text')}`}
              context='customers'
              value={countCustomerActiveSelector}
              listFilter={{ status:  'active' }}
              view={() => false}
              add={() => hasRole(['Admin'])}/>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>            
            <DashboardItem
              onLoad={{ type: sagaActions.COUNT_PRODUCTS, payload: { type: 'printer', params: { type: 'Printer' }}}}
              color='success'
              icon={PrintIcon}
              title={`${t('label.product.text')}`}
              context='products'
              value={countProductPrinterSelector}
              listFilter={{ type:  'Printer' }}
              view={() => false}
              add={() => hasRole(['Admin'])}/>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>            
            <DashboardItem
              onLoad={{ type: sagaActions.COUNT_CATEGORIES, payload: { type: 'problem', params: { type: 'Problem' }}}}
              color='rose'
              icon={CategoryIcon}
              title={`${t('label.category.text')}: ${t('label.category.type.problem')}`}
              context='categories'
              value={countCategoryProblemSelector}
              listFilter={{ type:  'Problem' }}
              view={() => false}
              add={() => hasRole(['Admin'])}/>
          </GridItem>
          <DisplayWhen roles={['Admin']}>
            <GridItem xs={12} sm={12} md={4}>
              <DashboardItem
                onLoad={{ type: sagaActions.COUNT_USERS, payload: { params: { status: 'active' }}}}
                color='info'
                icon={PeopleIcon}
                addIcon={PersonAddIcon}
                title={t('label.user.active')}
                context='users'
                value={countActiveUsers}
                listFilter={{ status:  'active' }}
                view={() => false}/>
            </GridItem>
          </DisplayWhen>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {dashboardSwitchRoutes}
          </GridItem>
        </GridContainer>
      </DisplayWhen>
    </div>
  );
}
