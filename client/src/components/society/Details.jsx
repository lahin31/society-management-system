import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { tConvert } from '../../helpers/TimeConvert';

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
      </div>
    </Dialog>
  );
};

export default React.memo(Details);
