import React, { useState, useEffect, useContext, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import './Details.scss';

import { tConvert } from '../../helpers/TimeConvert';

import AuthContext from '../../contexts/auth-context';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: '#C8252C',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    width: '80%',
    margin: '0 auto',
    marginTop: '25px',
  },
  rest: {
    marginTop: '20px',
  },
  rest_item: {
    fontSize: '24px',
    fontWeight: '500',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Details = ({ openDetails, handleClose, details }) => {
  const classes = useStyles();
  const [regMembers, setRegMembers] = useState([]);
  const context = useContext(AuthContext);

  useEffect(() => {
    if(details.registered_members) {
      fetch('/students/fetch_joining_students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + context.token,
        },
        body: JSON.stringify({
          joiningStudents: JSON.stringify(details.registered_members),
        }),
      })
      .then(res => res.json())
      .then(res => {
        setRegMembers(res.students)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [details, context.token]);

  return (
    <Dialog
      fullScreen
      open={openDetails}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {details.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <div className="description">
          <p>{details.description}</p>
        </div>
        <div className={classes.rest}>
          <h3>
            Created By:{' '}
            <span className={classes.rest_item}>
              {details.createdBy}
            </span>
          </h3>
          {details.date && (
            <h3>
              Date:{' '}
              <span className={classes.rest_item}>
                {new Date(details.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </h3>
          )}
          {details.time && (
            <h3>
              Time:{' '}
              <span className={classes.rest_item}>
                {tConvert(details.time)}
              </span>
            </h3>
          )}
        </div>
        <div className="joining_members_wrap">
        <h2>Joining Members:</h2>
          {regMembers && regMembers.length > 0 ? (
            <>
              { regMembers.map(regMember => {
                return <div className="joining_member_wrap" key={regMember._id}>
                  <span><b>{regMember.name}</b> from <b>{regMember.department.toUpperCase()}</b></span>
                </div>
              }) }
            </>
          ) : <h3>No members are joining for now</h3>}
        </div>
      </div>
    </Dialog>
  );
};

export default memo(Details);
