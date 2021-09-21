import Danger from 'components/Typography/Danger';
import Warning from 'components/Typography/Warning';
import { createMachine } from 'xstate';

export const orderItemMachine = (initialState) => createMachine({
  id: 'orderItem',
  initial: initialState,
  context: {
    add: {
      icon: 'add',
      actionLabel: 'label.action.order.add',
      color: 'warning',
      component: Warning
    },
    remove: {
      icon: 'delete',
      actionLabel: 'label.action.order.remove',
      color: 'danger',
      component: Danger
    }
  },
  states: {
    remove: {
      on: { TOGGLE: { target: 'add', actions: ['notifyAdd'] } },
      meta: {
        context: 'add',
      }
    },
    add: {
      on: { TOGGLE: { target: 'remove', actions: ['notifyRemove'] } },
      meta: {
        context: 'remove',
      }
    }
  }
});