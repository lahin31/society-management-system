import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AuthContext from '../../contexts/auth-context';
import fetchAuthUser from '../../api/fetch-authenticated-user';
import { genAccessToken } from '../../helpers/GenAccessToken';
import Details from '../../components/society/Details';
import Footer from '../../components/footer/Footer';
import './Search.scss';

const Search = () => {
  const [registered_societies, setRegisteredSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [details, setDetails] = useState({});
  const [openDetails, setOpenDetails] = useState(false);
  const [dept] = useState({
    cse: 'Computer Science & Engineering',
    eee: 'Electrical and Electronics Engineering',
    bba: 'Business Administration',
    eco: 'Economics',
    eng: 'English',
    jms: 'Journalism and Media Studies',
  });
  const { searchVal } = useParams();
  const context = useContext(AuthContext);

  useEffect(() => {
    genAccessToken();
  }, []);

  useEffect(() => {
    document.title = 'Search';
    let isMounted = true;

    fetchAuthUser(context)
      .then((student) => {
        if (student && isMounted) {
          setRegisteredSocieties(student.registered_societies);
        }
      })
      .catch((err) => console.log(err));

    return () => {
      isMounted = false;
    };
  }, [context]);

  useEffect(() => {
    fetch(`/society/search_events_notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
      body: JSON.stringify({
        searchVal,
        registered_societies,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setEvents(res.events_result);
        setNotices(res.notices_result);
      })
      .catch((err) => console.log(err));
  }, [registered_societies, context.token, searchVal]);

  const handleDetailsOpen = (item, type) => {
    item.createdBy = dept[item.createBy || item.createdBy];
    setDetails(item);
    setOpenDetails(true);
  };

  const handleClose = () => {
    setOpenDetails(false);
  };

  return (
    <div className="search_wrapper">
      <div className="events_search">
        <div className="search_title_wrap">
          <h2 className="search_title">Events</h2>
        </div>
        <div className="search_results">
          {events &&
            events.map((ev) => {
              return (
                <div className="content" key={ev._id}>
                  <div className="content_title">
                    <h2>
                      {ev.title}
                      <span className="category_event" tabIndex="0">
                        Event
                      </span>
                    </h2>
                  </div>
                  <div className="content_published_time">
                    <span style={{ color: 'gray' }}>
                      by <b>{dept[ev.createBy]}</b>{' '}
                      {new Intl.DateTimeFormat('en-GB').format(
                        new Date(ev.date)
                      )}{' '}
                      {ev.time.substr(11, 8)}
                    </span>
                  </div>
                  <div className="content_description">
                    <p>
                      {ev.description.substr(
                        0,
                        ev.description.length / 2
                      )}
                      ...
                    </p>
                  </div>
                  <div className="content_action">
                    <Button
                      className="btn-bg-color"
                      onClick={() => handleDetailsOpen(ev, 'event')}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          {events && events.length === 0 && searchVal && (
            <p>No events found</p>
          )}
        </div>
      </div>
      <div className="notices_search">
        <div className="search_title_wrap">
          <h2 className="search_title">Notices</h2>
        </div>
        <div className="search_results">
          {notices &&
            notices.map((nt) => {
              return (
                <div className="content" key={nt._id}>
                  <div className="content_title">
                    <h2>
                      {nt.title}
                      <span className="category_event" tabIndex="0">
                        Notice
                      </span>
                    </h2>
                  </div>
                  <div className="content_description">
                    <p>
                      {nt.description.substr(
                        0,
                        nt.description.length / 2
                      )}
                      ...
                    </p>
                  </div>
                  <div className="content_action">
                    <Button
                      className="btn-bg-color"
                      onClick={() => handleDetailsOpen(nt, 'notice')}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          {notices && notices.length === 0 && searchVal && (
            <p>No notices found</p>
          )}
        </div>
      </div>
      <Details
        openDetails={openDetails}
        handleClose={handleClose}
        details={details}
      />
      <Footer />
    </div>
  );
};

export default Search;
