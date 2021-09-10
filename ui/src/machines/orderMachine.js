import Primary from 'components/Typography/Primary';
import Success from 'components/Typography/Success';
import Danger from 'components/Typography/Danger';

import { createMachine } from 'xstate';

export const orderMachine = (initialState) => createMachine({
  id: 'order',
  initial: initialState,
  context: {
    closed: {
      icon: 'published_with_changes',
      label: 'label.order.status.closed',
      actionLabel: 'label.action.order.close',
      color: 'success',
      component: Success,
      spin: false
    },
    wip: {
      icon: 'sync',
      label: 'label.order.status.wip',
      actionLabel: 'label.action.order.wip',
      color: 'primary',
      component: Primary,
      spin: true
    },
    open: {
      icon: 'sync',
      label: 'label.order.status.open',
      actionLabel: 'label.action.order.open',
      color: 'danger',
      component: Danger,
      spin: false
    }
  },
  states: {
    closed: {
      on: { NEXT: { target: 'open' } },
      entry: ['notifyClosed'],
      meta: {
        context: 'open',
      }
    },
    wip: {
      on: { NEXT: { target: 'closed' } },
      entry: ['notifyWip'],
      meta: {
        context: 'closed',
      }
    },
    open: {
      on: { NEXT: { target: 'wip' } },
      entry: ['notifyOpen'],
      meta: {
        context: 'wip',
      }
    }
  }
});