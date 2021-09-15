import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import DeleteIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import ConfirmIcon from '@material-ui/icons/CheckOutlined';
import CancelIcon from '@material-ui/icons/CloseOutlined';
import styles from 'assets/jss/material-dashboard-react/components/tableStyle.js';
import { useTranslation } from 'react-i18next';
import IconButton from 'components/CustomButtons/Button.js';
import { isEmpty } from 'lodash-es';
import { Tooltip } from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { baseURL } from 'utils';

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { tableHead, tableData, tableHeaderColor, view, remove, pdf, callbackView, callbackRemove, pdfContext} = props;
  const [rowId, setRowId] = React.useState();
  const [toRemove, setToRemove] = React.useState();
  const action = view() || remove() || pdf();

  let actionWidth = 0;

  if(view()) {
    actionWidth += 50;
  }

  if(remove()) {
    actionWidth += view() ? 50 : 100;
  }

  if(pdf()) {
    actionWidth += 50;
  }

  const handleMouseLeave = () => {
    setRowId(null)
  }
  
  const handleMouseEnter = (rowId) => {
    setRowId(rowId);
  }

  const handleActionView = (id) => {
    callbackView(id);
  }

  const handleConfirmRemove = (prop) => {
    callbackRemove(prop);
  }

  const handleActionRemove = (id) => {
    setToRemove(toRemove === id ? null : id);
  }

  const viewBlock = (prop) => view() && (toRemove !== prop._id || isEmpty(toRemove)) ? (
    <IconButton disabled={rowId !== prop._id } justIcon round size="sm" color={rowId === prop._id ? tableHeaderColor : 'transparent'}
      onClick={() => handleActionView(prop._id)}>
      <EditIcon fontSize="inherit"/>
    </IconButton>
  ) : null;

  const confirmRemoveBlock = (prop) => remove() && toRemove === prop._id  ? (
    <IconButton justIcon round size="sm" color={rowId === prop._id ? 'success': 'transparent'}
      onClick={() => handleConfirmRemove(prop)}>
      <ConfirmIcon fontSize="inherit"/>
    </IconButton>
  ) : null;

  const removeBlock = (prop) => remove() ? (
    <IconButton disabled={rowId !== prop._id && toRemove !== prop._id }  justIcon round size="sm" color={rowId === prop._id || toRemove === prop._id ? 'danger' : 'transparent'}
      onClick={() => handleActionRemove(prop._id)} style={{ marginLeft: '10px' }}>
      {toRemove === prop._id ? <CancelIcon fontSize="inherit"/> : <DeleteIcon fontSize="inherit"/>}
    </IconButton>
  ) : null;

  const exportBlock = (prop) => pdf() ? (
    <Tooltip placement='left' title={t('export.pdf.text')}>
    <a href={`${baseURL}${pdfContext}/${prop._id}/export`} target="_blank" rel="noreferrer" style={{ color: 'inherit', marginLeft: '10px' }}>
      <IconButton justIcon round size="sm" color={rowId === prop._id ? tableHeaderColor : 'transparent'}>
        <PictureAsPdfIcon/>
      </IconButton>
    </a>
  </Tooltip>
  ) : null;

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + 'TableHeader']}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + ' ' + classes.tableHeadCell}
                    key={key}>
                    {t(prop)}
                  </TableCell>
                );
              })}
              {action ? (
                <TableCell style={{ width: `${actionWidth}px` }} className={classes.tableCell + ' ' + classes.tableHeadCell} />
              ): null}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody onMouseLeave={handleMouseLeave}>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow} hover onMouseEnter={() => handleMouseEnter(prop._id)}>
                {prop.items.map((prop, key) => {
                  return (
                    <TableCell className={classes.tableCell} key={key}>
                      {typeof prop == 'string' && prop.startsWith('label.') ? t(prop) : prop }
                    </TableCell>
                  );
                })}
                {action ? (
                  <TableCell className={classes.tableCell} style={{ width: `${actionWidth}px` }} >                 
                      {toRemove === prop._id ? (<p className={classes.tableHint}>{t('label.remove.hint')}</p>): null}
                      {viewBlock(prop)}
                      {confirmRemoveBlock(prop)}
                      {removeBlock(prop)}
                      {exportBlock(prop)}
                  </TableCell>
                ): null}
                
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: 'gray',
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.object),
  view: PropTypes.func,
  remove: PropTypes.func,
  pdf: PropTypes.func,
  pdfContext:PropTypes.string,
};
