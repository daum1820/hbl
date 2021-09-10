import Danger from 'components/Typography/Danger';
import Success from 'components/Typography/Success';
import { createMachine } from 'xstate';

export const statusMachine = (initialState) => createMachine({
  id: 'status',
  initial: initialState,
  context: {
    active: {
      icon: 'check_circle',
      label: 'label.status.active',
      actionLabel: 'label.action.activate',
      color: 'success',
      component: Success
    },
    inactive: {
      icon: 'do_not_disturb_on',
      label: 'label.status.inactive',
      actionLabel: 'label.action.inactivate',
      color: 'danger',
      component: Danger
    }
  },
  states: {
    inactive: {
      on: { TOGGLE: { target: 'active' } },
      entry: ['notifyInactive'],
      meta: {
        context: 'active',
      }
    },
    active: {
      on: { TOGGLE: { target: 'inactive' } },
      entry: ['notifyActive'],
      meta: {
        context: 'inactive',
      }
    }
  }
});