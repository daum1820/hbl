
import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from 'components/Snackbar/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { sagaActions }from 'sagas/actions.saga';

export default function Common() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.common.loading);
  const notifications = useSelector((state) => state.common.notifications); 

  const handleCloseNotification = (id) =>{
    dispatch({type: sagaActions.CLEAR_NOTIFICATION, payload: { id }});
  }

  return (
    <div>
      { isLoading ? (<LinearProgress />) : '' }
      { isLoading ? (<div style={{ position: 'absolute', width: '100vw', height: '100vh' , top: '0', left: '0', zIndex: '1000'}}></div>) : '' }
      { Object.entries(notifications).map(([id, n], key) => {
          return (
            <Snackbar
              place={n.place}
              color={n.color}
              icon={n.icon}
              message={n.message}
              open
              closeNotification={() => handleCloseNotification(id)}
              close
              key={key}
              params={n.params}
            />
          )
      })}
    </div>
  )
}