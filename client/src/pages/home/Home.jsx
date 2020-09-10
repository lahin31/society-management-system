import React, { useContext, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import GavelIcon from '@material-ui/icons/Gavel';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DetailsIcon from '@material-ui/icons/Details';
import AddIcon from '@material-ui/icons/Add';

import Loader from '../../components/loader/Loader';
import AuthContext from '../../contexts/auth-context';
import SocietyUpdate from '../../components/society/SocietyUpdate';
import Details from '../../components/society/Details';
import Footer from '../../components/footer/Footer';

import fetchAuthUser from '../../api/fetch-authenticated-user';

import { genAccessToken } from '../../helpers/GenAccessToken';
import { getExpirationDate } from '../../helpers/GetExpirationDate';
import { isExpired } from '../../helpers/IsExpired';
import { tConvert } from '../../helpers/TimeConvert';

import './Home.scss';

const HomePage = (props) => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});
  const [details, setDetails] = useState({});
  const [societies, setSocieties] = useState([]);
  const [selected_societies, setSelectedSocieties] = useState([]);
  const [registeredSocieties, setRegisteredSocieties] = useState([]);
  const [showEditBtn, setShowEditBtn] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openFollowDialog, setOpenFollowDialog] = useState(false);
  const context = useContext(AuthContext);

  useEffect(() => {
    genAccessToken();
  }, []);

  useEffect(() => {
    document.title = 'Home';
    let accessToken = JSON.parse(localStorage.getItem('accessToken'));
    if (!isExpired(getExpirationDate(accessToken))) {
      if (Object.keys(student).length) {
        fetchRegSocieties();
      }
    }
  }, [student]);

  useEffect(() => {
    let isMounted = true;

    fetchAuthUser(context)
      .then((student) => {
        if (student && isMounted) {
          setStudent(student);
          context.authenticateUser = student;
          if (
            student.registered_societies &&
            student.registered_societies.length >= 0
          ) {
            setSelectedSocieties(student.registered_societies);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });

    fetch('/society/get_societies')
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          setSocieties(res.societies);
        }
      })
      .catch((err) => console.log(err));

    return () => {
      // eslint-disable-next-line
      isMounted = false;
    };
  }, [context]);

  const handleOpenFollowDialog = () => {
    setOpenFollowDialog(true);
  };

  const handleCloseFollowDialog = (value) => {
    setOpenFollowDialog(false);
  };

  const handleSelectSociety = (index) => {
    let new_societies = [...societies];
    let new_selected_societies = [...selected_societies];

    new_societies[index].select = !new_societies[index].select;

    new_selected_societies.push(new_societies[index]._id);
    setSelectedSocieties(new_selected_societies);
  };

  const procceedSelectedSociety = () => {
    fetch('/society/selected_societies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
      body: JSON.stringify({
        userId: context.userId,
        selected_societies: JSON.stringify(selected_societies),
        student_id: student._id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.student) {
          setStudent(res.student);
          context.authenticateUser = res.student;
          if (
            res.student.registered_societies &&
            res.student.registered_societies.length >= 0
          ) {
            setSelectedSocieties(res.student.registered_societies);
          }
          setLoading(false);

          fetchAuthUser(context)
            .then((student) => {
              if (student) {
                setStudent(student);
                context.authenticateUser = student;
                if (
                  student.registered_societies &&
                  student.registered_societies.length >= 0
                ) {
                  setSelectedSocieties(student.registered_societies);
                }
                setLoading(false);
              }
            })
            .catch((err) => {
              setLoading(false);
            });

          fetch('/society/get_societies')
            .then((res) => res.json())
            .then((res) => {
              setSocieties(res.societies);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    context.logout();
    props.history.push('/login');
  };

  const goToEditPage = (username) => {
    props.history.push(`/edit-profile/${username}`);
  };

  const fetchRegSocieties = () => {
    fetch('/society/registered_societies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
      body: JSON.stringify({
        societies: JSON.stringify(student.registered_societies),
      }),
    })
      .then((res) => res.json())
      .then((res) => setRegisteredSocieties(res.registered_societies))
      .catch((err) => console.log(err));
  };

  const handleFollowUnfollowSociety = (
    follow_unfollow_result,
    society_id
  ) => {
    fetch('/society/update_registered_society', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
      body: JSON.stringify({
        student_id: student._id,
        society_id,
        follow_unfollow_result,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === 'Updated') {
          fetchAuthUser(context)
            .then((student) => {
              if (student) {
                setStudent(student);
                context.authenticateUser = student;
                if (
                  student.registered_societies &&
                  student.registered_societies.length >= 0
                ) {
                  setSelectedSocieties(student.registered_societies);
                }
                setLoading(false);
                handleCloseFollowDialog();
              }
            })
            .catch((err) => {
              setLoading(false);
            });

          fetch('/society/get_societies')
            .then((res) => res.json())
            .then((res) => {
              setSocieties(res.societies);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDetailsOpen = (item, createdBy) => {
    item.createdBy = createdBy;
    setDetails(item);
    setOpenDetails(true);
  };

  const handleClose = () => {
    setOpenDetails(false);
  };

  const goToDetails = id => {
    props.history.push(`/societies/${id}`);
  }

  return (
    <div
      className="home_wrapper"
      style={{
        display: Object.keys(student).length === 0 ? 'flex' : 'block',
        justifyContent:
          Object.keys(student).length === 0 ? 'center' : 'stretch',
        alignItems:
          Object.keys(student).length === 0 ? 'center' : 'stretch',
      }}
    >
      {loading &&
      Object.keys(student).length === 0 &&
      student.constructor === Object ? (
        <div className="loader_wrap">
          <Loader width={140} height={140} />
        </div>
      ) : (
        <>
          {student.registered_societies &&
          student.registered_societies.length === 0 ? (
            <SocietyUpdate
              message="Please select society"
              societies={societies}
              handleSelectSociety={handleSelectSociety}
              procceedSelectedSociety={procceedSelectedSociety}
            />
          ) : (
            <div className="society_home">
              <div className="responsive_action_area">
                <div className="details_icon">
                  <DetailsIcon />
                </div>
                <div
                  className="follow_icon"
                  onClick={handleOpenFollowDialog}
                >
                  <AddIcon />
                </div>
              </div>
              <div className="user_details_area">
                <div className="profile_info">
                  {student.profile_picture !== '' ? (
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/uploads/' +
                        student.profile_picture
                      }
                      alt={student.name}
                      onMouseEnter={() => setShowEditBtn(true)}
                      onMouseLeave={() => setShowEditBtn(false)}
                    />
                  ) : (
                    <img
                      src={require('../../assets/images/default_img.png')}
                      alt="user avatar"
                      onMouseEnter={() => setShowEditBtn(true)}
                      onMouseLeave={() => setShowEditBtn(false)}
                    />
                  )}
                  <div
                    className="edit_msg"
                    style={{
                      display: showEditBtn ? 'block' : 'none',
                    }}
                    onMouseEnter={() => setShowEditBtn(true)}
                    onMouseLeave={() => setShowEditBtn(false)}
                  >
                    <span
                      onClick={() =>
                        goToEditPage(
                          context.authenticateUser.username
                        )
                      }
                    >
                      Edit
                    </span>
                  </div>
                  <div className="profile_name">
                    <h3>
                      <Link
                        to={
                          '/profile/' +
                          context.authenticateUser.username
                        }
                      >
                        {student.name}
                      </Link>
                    </h3>
                  </div>
                  <hr />
                  <div className="links_wrap">
                    <div className="link">
                      <Link
                        to={
                          '/profile/' +
                          context.authenticateUser.username
                        }
                      >
                        <ListItem button>
                          <ListItemIcon>
                            <PersonIcon color="primary" />
                          </ListItemIcon>
                          Profile
                        </ListItem>
                      </Link>
                    </div>
                    <div className="link">
                      <Link
                        to={
                          '/profile/' +
                          context.authenticateUser.username
                        }
                      >
                        <ListItem button>
                          <ListItemIcon>
                            <GavelIcon color="primary" />
                          </ListItemIcon>
                          Code of Conduct
                        </ListItem>
                      </Link>
                    </div>
                    <div className="link">
                      <Link
                        to={
                          '/profile/' +
                          context.authenticateUser.username
                        }
                      >
                        <ListItem button>
                          <ListItemIcon>
                            <ContactMailIcon color="primary" />
                          </ListItemIcon>
                          Contact us
                        </ListItem>
                      </Link>
                    </div>
                    <div className="link">
                      <Link
                        to={
                          '/profile/' +
                          context.authenticateUser.username
                        }
                      >
                        <ListItem button>
                          <ListItemIcon>
                            <InfoIcon color="primary" />
                          </ListItemIcon>
                          About
                        </ListItem>
                      </Link>
                    </div>
                    <div className="link">
                      <ListItem
                        button
                        onClick={handleLogout}
                        className="home_logout_btn"
                      >
                        <ListItemIcon>
                          <ExitToAppIcon color="primary" />
                        </ListItemIcon>
                        Logout
                      </ListItem>
                    </div>
                  </div>
                  <hr />
                  <div className="socities_list_wrap">
                    {registeredSocieties &&
                      registeredSocieties.map((reg_society) => (
                        <div
                          className="society"
                          key={reg_society._id}
                          onClick={() => goToDetails(reg_society._id)}
                        >
                          <ListItem button>
                            {reg_society.name}
                          </ListItem>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="home_content">
                <div className="contents events events_contents">
                  {registeredSocieties &&
                    registeredSocieties.map((registeredSociety) => {
                      return registeredSociety.events.map(
                        (registeredSocietyEvent) => {
                          return (
                            <div
                              className="content"
                              key={registeredSocietyEvent._id}
                            >
                              <div className="content_title">
                                <h2>
                                  {registeredSocietyEvent.title}
                                  <span
                                    className="category_event"
                                    tabIndex="0"
                                  >
                                    Event
                                  </span>
                                </h2>
                              </div>
                              <div className="content_published_time">
                                <span style={{ color: 'gray' }}>
                                  by <b style={{ cursor: 'pointer' }} onClick={() => goToDetails(registeredSociety._id)}>{registeredSociety.name}</b>{' '}
                                  {new Intl.DateTimeFormat(
                                    'en-GB'
                                  ).format(
                                    new Date(
                                      registeredSocietyEvent.date
                                    )
                                  )}{' '}
                                  {tConvert(registeredSocietyEvent.time)}
                                </span>
                              </div>
                              <div className="content_description">
                                <p>
                                  {registeredSocietyEvent.description.substr(
                                    0,
                                    registeredSocietyEvent.description
                                      .length / 2
                                  )}
                                  ...
                                </p>
                              </div>
                              <div className="content_action">
                                <Button
                                  className="btn-bg-color"
                                  onClick={() =>
                                    handleDetailsOpen(
                                      registeredSocietyEvent,
                                      registeredSociety.name
                                    )
                                  }
                                >
                                  Details
                                </Button>
                              </div>
                            </div>
                          );
                        }
                      );
                    })}
                </div>
                <div className="contents notices notices_contents">
                  {registeredSocieties &&
                    registeredSocieties.map((registeredSociety) => {
                      return registeredSociety.notices.map(
                        (registeredSocietyNotice) => {
                          return (
                            <div
                              className="content"
                              key={registeredSocietyNotice._id}
                            >
                              <div className="content_title">
                                <h2>
                                  {registeredSocietyNotice.title}
                                  <span
                                    className="category_notice"
                                    tabIndex="0"
                                  >
                                    Notice
                                  </span>
                                </h2>
                              </div>
                              <div className="content_published_time">
                                <span style={{ color: 'gray' }}>
                                  by <b>{registeredSociety.name}</b>{' '}
                                </span>
                              </div>
                              <div className="content_description">
                                <p>
                                  {registeredSocietyNotice.description.substr(
                                    0,
                                    registeredSocietyNotice
                                      .description.length / 2
                                  )}
                                  ...
                                </p>
                              </div>
                              <div className="content_action">
                                <Button
                                  className="btn-bg-color"
                                  onClick={() =>
                                    handleDetailsOpen(
                                      registeredSocietyNotice,
                                      registeredSociety.name
                                    )
                                  }
                                >
                                  Details
                                </Button>
                              </div>
                            </div>
                          );
                        }
                      );
                    })}
                </div>
                <Footer />
              </div>
              <div className="statistics_society_area">
                <div className="statistcs_area">
                  <p>
                    There are 10 societies, you have registered{' '}
                    {registeredSocieties &&
                      registeredSocieties.length}{' '}
                    society
                  </p>
                </div>
                <div className="societies_area">
                  <div className="societies_area_title">
                    Societies
                  </div>
                  <hr />
                  {societies.map((society) => {
                    let follow_unfollow_result =
                      registeredSocieties &&
                      registeredSocieties.length > 0
                        ? registeredSocieties.some(
                            (reg_soc) => reg_soc._id === society._id
                          )
                          ? 'UnFollow'
                          : 'Follow'
                        : '';
                    return (
                      <div className="society" key={society._id}>
                        <div className="society_title" onClick={() => goToDetails(society._id)}>
                          <span className="title">
                            {society.name}
                          </span>
                        </div>
                        <div className="society_action_btn">
                          <button
                            className="action_btn"
                            onClick={() =>
                              handleFollowUnfollowSociety(
                                follow_unfollow_result === 'UnFollow'
                                  ? 'Unfollow'
                                  : 'Follow',
                                society._id
                              )
                            }
                          >
                            {follow_unfollow_result}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <Details
        openDetails={openDetails}
        handleClose={handleClose}
        details={details}
      />
      <Dialog
        className="follow_unfollow_dialog_wrap"
        onClose={handleCloseFollowDialog}
        aria-labelledby="follow_unfollow_in_mobile_device"
        open={openFollowDialog}
      >
        <DialogTitle id="societies_title">Societies</DialogTitle>
        <div className="societies_follow_unfollow_wrap">
          {societies.map((society) => {
            let follow_unfollow_result =
              registeredSocieties && registeredSocieties.length > 0
                ? registeredSocieties.some(
                    (reg_soc) => reg_soc._id === society._id
                  )
                  ? 'UnFollow'
                  : 'Follow'
                : '';
            return (
              <div className="society" key={society._id}>
                <div className="society_title">
                  <span className="title">{society.name}</span>
                </div>
                <div className="society_action_btn">
                  <button
                    className="action_btn"
                    onClick={() =>
                      handleFollowUnfollowSociety(
                        follow_unfollow_result === 'UnFollow'
                          ? 'Unfollow'
                          : 'Follow',
                        society._id
                      )
                    }
                  >
                    {follow_unfollow_result}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Dialog>
    </div>
  );
};

export default withRouter(HomePage);
