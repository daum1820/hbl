import React from 'react';
import PropTypes from 'prop-types';
import { DisplayWhen } from 'utils/auth.utils';
import DeleteIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ConfirmIcon from '@material-ui/icons/CheckOutlined';
import CancelIcon from '@material-ui/icons/CloseOutlined';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from 'components/CustomButtons/Button.js';
import { useDispatch } from 'react-redux';
import history from 'lib/history';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { whiteColor } from 'assets/jss/material-dashboard-react';

const useStyles = makeStyles({
  removeWrapper: {
    margin: '0px 10px',
    display: 'flex'
  },
  removeHint: {
    margin: '12px 10px',
    backgroundColor: "#777",
    fontWeight: 400,
    color: whiteColor,
    padding: '0.250rem 1rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(109 108 108 / 40%)',
  }
});

export default function ConfirmDelete(props)  {
  const classes = useStyles();
  const { t } = useTranslation();
  const { id, removeAction, color, context } = props;
  const dispatch = useDispatch();

  const [remove, setRemove] = React.useState(false);

  const handleConfirmRemove = async () => {
    await dispatch({ type: removeAction, payload: { id }});
    history.push(`/${context}`);
  }

  const handleActionRemove = () => {
    setRemove(!remove);
  }

  return (
    <DisplayWhen check={() => !!id }>
      <ClickAwayListener onClickAway={() => setRemove(false)}>
        <div className={classes.removeWrapper}>
          { remove ?
          <IconButton justIcon round color='success' onClick={() => handleConfirmRemove()} style={{ marginRight: '10px'}}>
            <ConfirmIcon fontSize="inherit"/>
          </IconButton>
          : null}
          <IconButton justIcon round color={remove ? 'danger' : color} onClick={() => handleActionRemove()}>
            { remove ? <CancelIcon fontSize="inherit"/> : <DeleteIcon fontSize="inherit"/>}
          </IconButton>
          { remove ? (<p className={classes.removeHint}>{t('label.remove.hint')}</p>): null}
        </div>
      </ClickAwayListener>
    </DisplayWhen>
  );
}

ConfirmDelete.propTypes = {
  id: PropTypes.string,
  color: PropTypes.string,
};