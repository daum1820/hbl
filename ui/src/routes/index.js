import DashboardIcon from '@material-ui/icons/Dashboard';
import UserIcon from '@material-ui/icons/PeopleAltRounded';
import CategoryIcon from '@material-ui/icons/Category';
import PrintIcon from '@material-ui/icons/Print';
import StoreIcon from '@material-ui/icons/Store';
import { getUserListSelector } from 'features/users.feature';
import DashboardPage from 'views/Dashboard/Dashboard';
import UserDetails from 'views/User/UserDetails';
import { sagaActions }from 'sagas/actions.saga';
import CommonList from 'components/Common/CommonList';
import { getCategoryListSelector } from 'features/categories.feature';
import { getProductListSelector } from 'features/products.feature';
import { CategoriesDetails } from 'views/Categories/CategoriesDetails';
import { hasRole } from 'utils/auth.utils';
import { ProductsDetails } from 'views/Products/ProductsDetails';
import { getCustomerListSelector } from 'features/customers.feature';
import { CustomersDetails } from 'views/Customers/CustomersDetails';
import { InvoicesDetails } from 'views/Invoices/InvoicesDetails';
import { getInvoiceListSelector } from 'features/invoices.feature';
import { Receipt } from '@material-ui/icons';
import { formatCurrency } from 'utils';
import { formatDate } from 'utils';
import Success from 'components/Typography/Success';
import Danger from 'components/Typography/Danger';
import { Trans } from 'react-i18next';
import Info from 'components/Typography/Info';
import { getOrderListSelector } from 'features/orders.feature';
import Primary from 'components/Typography/Primary';
import { OrderDetails } from 'views/Orders/OrderDetails';
import { formatFullDate } from 'utils';
import Muted from 'components/Typography/Muted';
import Warning from 'components/Typography/Warning';

const appRoutes = [
  {
    path: '/invoices/:id',
    component: InvoicesDetails,
    color: 'danger',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/orders/:id',
    component: OrderDetails,
    color: 'warning',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/profile',
    component: UserDetails,
    color: 'warning',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/users/create',
    component: UserDetails,
    color: 'info',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/users/:id',
    component: UserDetails,
    color: 'info',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/categories/create',
    component: CategoriesDetails,
    color: 'rose',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/categories/:id',
    component: CategoriesDetails,
    color: 'rose',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/products/create',
    component: ProductsDetails,
    color: 'success',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/products/:id',
    component: ProductsDetails,
    color: 'success',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/customers/create',
    component: CustomersDetails,
    color: 'primary',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/customers/:id',
    component: CustomersDetails,
    color: 'primary',
    sidebar: () => false,
    dashboard: () => false,
  },
  {
    path: '/dashboard',
    name: 'menu.dashboard',
    icon: DashboardIcon,
    component: DashboardPage,
    sidebar: () => true,
    dashboard: () => false,
  },
  {
    path: '/invoices',
    icon: Receipt,
    name: 'menu.invoices',
    component: CommonList,
    listSaga: sagaActions.LIST_INVOICES,
    removeSaga: sagaActions.DELETE_INVOICE,
    pdfContext: 'invoices',
    headers: ['label.invoice.code', 'label.invoice.customer', 'label.invoice.total', 'label.invoice.amountPaid', 'label.invoice.createdAt', 'label.invoice.dueDate', 'label.status.text'],
    properties: [
      'invoiceNumber', 
      (item) => `${item.customer.name} (${item.customer.registrationNr})`,
      (item) => {
        const amount = item.amount - item.discount  - item.amountPaid;
        const Component = amount === 0 ? Primary : amount > 0  ? Danger : Success;
        return (<Component>{formatCurrency(amount)}</Component>)
      },
      (item) => {
        const amount = item.amountPaid;
        const Component = amount === 0 ? Primary : amount > 0  || item.status === 'closed' ? Success : Danger;
        return (<Component>{formatCurrency(amount)}</Component>)
      },
      (item) => formatDate(item.createdAt),
      (item) => formatDate(item.dueDate),
      (item) => {
        const label = `label.invoice.status.${item.status.toLowerCase()}`;
        const Component = item.status === 'open' ? Info : Success;
        return (<Component><Trans i18nKey={label}/></Component>)
      }],
    listSelector: getInvoiceListSelector,
    emptyMessage: 'error.invoice.empty',
    color: 'danger',
    sidebar: () => hasRole(['Admin']),
    dashboard: () => hasRole(['Admin']),
    create: () => false,
    view: () => hasRole(['Admin']),
    remove: () => hasRole(['Admin']),
    pdf: () => hasRole(['Admin'])
  },
  {
    path: '/orders',
    icon: "engineering",
    name: 'menu.orders',
    component: CommonList,
    listSaga: sagaActions.LIST_ORDERS,
    removeSaga: sagaActions.DELETE_ORDER,
    pdfContext: 'orders',
    headers: ['label.order.code', 'label.invoice.customer', 'label.order.createdAt', 'label.category.type.problem', 'label.order.technicalUser', 'label.order.status.text'],
    properties: [
      'orderNumber', 
      (item) => `${item.customer.name} (${item.customer.registrationNr})`,
      (item) => formatFullDate(item.createdAt),
      (item) => `${item.problem._id} - ${item.problem.name}`,
      (item) => !!item.technicalUser ? `${item.technicalUser?.name} ${item.technicalUser?.lastName }` : null,
      (item) => {
        const label = `label.order.status.${item.status.toLowerCase()}`;
        const Component = item.status === 'wip' ? Primary : item.status === 'open' ? Danger : item.status === 'pending' ? Warning : item.status === 'empty' ? Muted : Success;
        return (<Component><Trans i18nKey={label}/></Component>)
      }],
    listSelector: getOrderListSelector,
    emptyMessage: 'error.order.empty',
    color: 'warning',
    sidebar: () => true,
    dashboard: () => true,
    create: () => false,
    view: () => true,
    remove: () => hasRole(['Admin', 'Moderator']),
    pdf: (order) => !!order ? Object.keys(order?.items || {}).length > 0 : true
  },
  {
    path: '/customers',
    icon: StoreIcon,
    name: 'menu.customers',
    component: CommonList,
    listSaga: sagaActions.LIST_CUSTOMERS,
    removeSaga: sagaActions.DELETE_CUSTOMER,
    headers: ['label.code', 'label.name', 'label.customers.fullName', 'label.customers.contactName', 'label.customers.contactEmail', 'label.customers.contactPhone', 'label.status.text'],
    properties: ['customerNumber', 'name', 'fullName', 'contactName', 'contactEmail', 'contactPhone', 
    (item) => {
      const label = `label.status.${item.status.toLowerCase()}`;
      const Component = item.status === 'active' ? Success : Danger;
      return (<Component><Trans i18nKey={label}/></Component>)
    }],
    listSelector: getCustomerListSelector,
    emptyMessage: 'error.customer.empty',
    color: 'primary',
    sidebar: () => hasRole(['Admin', 'Moderator']),
    dashboard: () => hasRole(['Admin', 'Moderator']),
    create: () => hasRole(['Admin']),
    view: () => hasRole(['Admin']),
    remove: () => hasRole(['Admin'])
  },
  {
    path: '/categories',
    icon: CategoryIcon,
    name: 'menu.categories',
    component: CommonList,
    listSaga: sagaActions.LIST_CATEGORIES,
    removeSaga: sagaActions.DELETE_CATEGORY,
    headers: ['label.category.code', 'label.name', 'label.category.type.text'],
    properties: ['_id', 'name', (item) => `label.category.type.${item.type.toLowerCase()}`],
    listSelector: getCategoryListSelector,
    emptyMessage: 'error.category.empty',
    color: 'rose',
    sidebar: () => hasRole(['Admin', 'Moderator']),
    dashboard: () => hasRole(['Admin', 'Moderator']),
    create: () => hasRole(['Admin']),
    view: () => hasRole(['Admin']),
    remove: () => hasRole(['Admin'])
  },
  {
    path: '/products',
    icon: PrintIcon,
    name: 'menu.products',
    component: CommonList,
    listSaga: sagaActions.LIST_PRODUCTS,
    removeSaga: sagaActions.DELETE_PRODUCT,
    headers: ['label.product.model.code', 'label.description', 'label.product.type.text', 'label.product.brand'],
    properties: ['model', 'description', (item) => `label.product.type.${item.type.toLowerCase()}`, (item) => item.brand?.name ],
    listSelector: getProductListSelector,
    emptyMessage: 'error.product.empty',
    color: 'success',
    sidebar: () => hasRole(['Admin', 'Moderator']),
    dashboard: () => hasRole(['Admin', 'Moderator']),
    create: () => hasRole(['Admin']),
    view: () => hasRole(['Admin']),
    remove: () => hasRole(['Admin'])
  },
  {
    path: '/users',
    icon: UserIcon,
    name: 'menu.users',
    component: CommonList,
    listSaga: sagaActions.LIST_USERS,
    removeSaga: sagaActions.DELETE_USER,
    headers: ['label.user.name', 'label.name', 'label.lastname', 'label.email', 'label.phone', 'label.status.text'],
    properties: ['username', 'name', 'lastName', 'email', 'phone', 
      (item) => {
        const label = `label.status.${item.status.toLowerCase()}`;
        const Component = item.status === 'active' ? Success : Danger;
        return (<Component><Trans i18nKey={label}/></Component>)
      }],
    listSelector: getUserListSelector,
    emptyMessage: 'error.user.empty',
    color: 'info',
    sidebar: () => hasRole(['Admin']),
    dashboard: () => hasRole(['Admin']),
    create: () => hasRole(['Admin']),
    view: () => hasRole(['Admin']),
    remove: () => hasRole(['Admin'])
  },
];


export default appRoutes;