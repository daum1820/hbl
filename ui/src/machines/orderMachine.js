import Primary from 'components/Typography/Primary';
import Success from 'components/Typography/Success';

import { createMachine } from 'xstate';
import Warning from 'components/Typography/Warning';
import { hasRole } from 'utils/auth.utils';
import Danger from 'components/Typography/Danger';

export const orderMachine = (initialState) =>  {
  const isUser = !hasRole(['Admin', 'Moderator']);

  return createMachine({
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
      approve: {
        icon: 'fingerprint',
        label: 'label.order.status.approve',
        actionLabel: 'label.action.order.approve',
        color: 'warning',
        component: Warning,
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
        icon: 'replay',
        label: 'label.order.status.open',
        actionLabel: 'label.action.order.open',
        color: 'danger',
        component: Danger,
        spin: false
      }
    },
    states: {
      closed: {
        on: { 
          NEXT: { target: 'open', actions: ['notifyOpen'] },
          CLOSE: { target: 'closed' }
        },
        meta: {
          context: isUser ? '' : 'open',
        }
      },
      approve: {
        on: { 
          NEXT: { target: 'closed', actions: ['notifyClosed'] },
          CLOSE: { target: 'closed' }
        },
        meta: {
          context: isUser ? '' : 'closed',
        }
      },
      wip: {
        on: { 
          NEXT: { target: isUser ? 'approve' : 'closed', actions: [isUser ? 'notifyApprove' : 'notifyClosed'] },
          CLOSE: { target: 'closed' }
        },
        meta: {
          context: isUser ? 'approve' : 'closed',
        }
      },
      open: {
        on: { 
          NEXT: { target: 'wip', actions: ['notifyWip'] },
          CLOSE: { target: 'closed' }
        },
        meta: {
          context: 'wip',
        }
      }
    }
  });
}