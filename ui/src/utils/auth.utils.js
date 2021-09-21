import React from "react";
import { useSelector } from "react-redux";
import { isEmpty } from 'lodash';
import { readFromToken } from "lib/token";

export function DisplayWhen(props) {
  const {children, roles = [], check = () => true } = props;
  const role = useSelector((state) => state.auth.authUser.role);

  const [hasRole] = React.useState(isEmpty(roles) || roles.includes(role))

  return hasRole && check() ? children  : '';

}

export const hasRole = (roles = []) => {
  const role = readFromToken('role');
  return isEmpty(roles) || roles.includes(role);
}