import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LocalPrintshopOutlined from '@material-ui/icons/LocalPrintshopOutlined';
import Navbar from 'components/Navbars/Navbar';
import Sidebar from 'components/Sidebar/Sidebar';
import routes from 'routes';
import styles from 'assets/jss/material-dashboard-react/layouts/adminStyle.js';
import bgImage from 'assets/img/sidebar.jpeg';
import Common from './Common';
import { useQuery } from 'utils';
import ProtectedRoute from 'routes/ProtectedRoute';

const useStyles = makeStyles(styles);

export default function Main({ ...rest }) {
  const query = useQuery();
  const { t } = useTranslation();
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image] = React.useState(bgImage);
  const [color] = React.useState('primary');
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const switchRoutes = (
    <Switch>
      {routes.map((props, key) => {
          const {component:Component, ...rest} = props
          return (
            <ProtectedRoute
              path={props.path}
              key={key}>
                <Component filter={Object.fromEntries(query)} {...rest}/>
            </ProtectedRoute>
          );
      })}
      <Redirect from="/" to="/dashboard" />
    </Switch>
  );
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      document.body.style.overflow = 'hidden';
    }
    window.addEventListener('resize', resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener('resize', resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <Common />
      <Sidebar
        routes={routes.filter(r => r.sidebar())}
        logoText={t('company.name')}
        logoIcon={LocalPrintshopOutlined}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            {switchRoutes}
          </div>
        </div>
      </div>
    </div>
  );
}