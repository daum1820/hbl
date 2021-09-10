import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { Route, Switch, HashRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Main from './layout/Main';
import store from 'lib/store';
import history from 'lib/history';

import 'lib/config';
import './index.css';
import './i18n';
import Login from 'layout/Login';
import UserLogin from 'views/User/UserLogin';
import { UserPassword } from 'views/User/UserPassword';
import ProtectedRoute from 'routes/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      light: "#4791db",
      main: "#1976d2",
      dark: "#115293",
    }
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Suspense  fallback={null}>
        <Router history={history}>
          <Switch>
            <Route path="/login">
              <Login>
                <UserLogin />
              </Login>
            </Route>
            <ProtectedRoute path="/change-password">
              <Login>
                <UserPassword
                  isLogin
                  title='label.password.update' 
                  showChangePassword={false}/>
              </Login>
            </ProtectedRoute> 
            <ProtectedRoute path="/">
              <Main />
            </ProtectedRoute> 
          </Switch>
        </Router>
      </Suspense>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
