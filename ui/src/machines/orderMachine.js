import { assign, createMachine } from 'xstate';
import { hasRole } from 'utils/auth.utils';

export const orderMachine = (initialState, validate = {}) =>  {

  const isUser = !hasRole(['Admin', 'Moderator']);

  return createMachine({
    id: 'order',
    initial: initialState,
    context: {
      actual: {
        icon: 'replay',
        actionIcon: 'sync',
        label: 'label.order.status.open',
        actionLabel: 'label.action.order.wip',
        color: 'danger',
        actionColor: 'primary',
        spin: false,
        actionSpin: true,
        canExecute: false
      }
    },
    states: {
      closed: {
        on: { 
          NEXT: { 
            target: 'wip',
            actions: ['notifyWip']
          },
          CLOSED: { target: 'closed' },
          WIP: { target: 'wip' },
          APPROVE: {target: 'approve' },
          OPEN: { target: 'open' }
        },
        entry: [
          assign({
            actual: () => ({
              icon: 'published_with_changes',
              actionIcon: 'replay',
              label: 'label.order.status.closed' ,
              actionLabel: 'label.action.order.open',
              color: 'success',
              actionColor: 'danger',
              spin: false,
              actionSpin: false,
              canExecute: !isUser
            })
          })
        ]
      },
      approve: {
        on: { 
          NEXT: { 
            target: 'closed',
            actions: ['notifyClosed']
          },
          CLOSED: { target: 'closed' },
          WIP: { target: 'wip' },
          APPROVE: {target: 'approve' },
          OPEN: { target: 'open' }
        },
        entry: [
          assign({
            actual: () => ({
              icon: 'fingerprint',
              actionIcon: 'published_with_changes',
              label: 'label.order.status.pending' ,
              actionLabel: 'label.action.order.close',
              color: 'warning',
              actionColor: 'success',
              spin: false,
              actionSpin: false,
              canExecute: !isUser
            })
          })
        ]
      },
      wip: {
        on: { 
          NEXT: { target: 'validate' },
          CLOSED: { target: 'closed' },
          WIP: { target: 'wip' },
          APPROVE: {target: 'approve' },
          OPEN: { target: 'open' }
        },
        entry: [
          assign({
            actual: () => ({ 
              icon: 'sync',
              actionIcon: isUser ? 'fingerprint' : 'published_with_changes',
              label: isUser ? 'label.order.status.pending' : 'label.order.status.closed',
              actionLabel: isUser ? 'label.action.order.approve' : 'label.action.order.close',
              color: 'primary',
              actionColor: isUser ? 'warning' : 'success',
              spin: true,
              actionSpin: false,
              canExecute: true
            })
          })
        ]
      },
      open: {
        on: { 
          NEXT: {
            target: 'wip',
            actions: ['notifyWip']
          },
          CLOSED: { target: 'closed' },
          WIP: { target: 'wip' },
          APPROVE: {target: 'approve' },
          OPEN: { target: 'open' }
        },
        entry: [
          assign({
            actual: () => ({ 
              icon: 'replay',
              actionIcon: 'sync',
              label: 'label.order.status.open',
              actionLabel: 'label.action.order.wip',
              color: 'danger',
              actionColor: 'primary',
              spin: false,
              actionSpin: true,
              canExecute: true
            })
          })
        ]
      },
      validate
    }
  });
}