import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { isEmpty } from 'lodash';

export default function ProtectedRoute ({ children, roles = [], ...rest }) {
  const isAuth = useSelector((state) => state.auth.auth);
  const role = useSelector((state) => state.auth.authUser.role);

  const [hasRole] = React.useState(isEmpty(roles) || roles.includes(role))
  
  return (
    <Route {...rest} render={({ location }) => {
      return isAuth === true && hasRole
        ? children
        : <Redirect to={{
          pathname: '/login',
          state: { from: location }
        }}/>
    }} />
  )
}