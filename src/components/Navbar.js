import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import { FiLogOut } from 'react-icons/fi';
import { withCookies } from 'react-cookie';

import '../App.scss';

const useStyles = makeStyles((theme) => ({
  bg: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  const { askList, profiles } = useContext(ApiContext);
  const Logout = () => (event) => {
    props.cookies.remove('current-token');
    window.location.href = '/';
  };
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h5' className={classes.title}>
          SNS App
        </Typography>
        <Badge
          className={classes.bg}
          badgeContent={
            askList.filter((ask) => {
              return (
                // 友人申請が許可されていない
                ask.approved === false &&
                // 友人申請を送った人が存在する
                profiles.filter((item) => {
                  return item.userPro === ask.askFrom;
                })[0]
              );
              // ２つの項目に当てはまるデータの個数を返す
            }).length
          }
          color='secondary'
        >
          <NotificationsIcon />
        </Badge>
        <button className='signOut' onClick={Logout()}>
          <FiLogOut />
        </button>
      </Toolbar>
    </AppBar>
  );
};

export default withCookies(Navbar);
