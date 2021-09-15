import Info from 'components/Typography/Info';
import Success from 'components/Typography/Success';
import { createMachine } from 'xstate';

export const invoiceMachine = (initialState) => createMachine({
  id: 'invoice',
  initial: initialState,
  context: {
    closed: {
      icon: 'attach_money',
      label: 'label.invoice.status.closed',
      actionLabel: 'label.action.close',
      color: 'success',
      component: Success
    },
    open: {
      icon: 'payments',
      label: 'label.invoice.status.open',
      actionLabel: 'label.action.reopen',
      color: 'info',
      component: Info
    }
  },
  states: {
    closed: {
      on: { TOGGLE: { target: 'open' } },
      exit: ['notifyOpen'],
      meta: {
        context: 'open',
      }
    },
    open: {
      on: { TOGGLE: { target: 'closed' } },
      exit: ['notifyClosed'],
      meta: {
        context: 'closed',
      }
    }
  }
});