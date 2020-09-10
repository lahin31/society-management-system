import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import AuthContext from '../../contexts/auth-context';
import fetchAuthUser from '../../api/fetch-authenticated-user';
import './SocietyUpdate.scss';

const SocietyUpdate = (props) => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});
  const [societies, setSocieties] = useState([]);
  const [selected_societies, setSelectedSocieties] = useState([]);
  const [selected, setSelected] = useState(false);
  const [registeredSocities, setRegisteredSocities] = useState([]);
  const [showEditBtn, setShowEditBtn] = useState(false);
  const context = useContext(AuthContext);

  // useEffect(() => {
  //   if (Object.keys(student).length) {
  //     fetchRegSocieties();
  //   }
  // }, [student]);

  // const fetchRegSocieties = () => {
  //   fetch("/society/registered_societies", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       societies: JSON.stringify(student.registered_societies),
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res.societies)
  //       setRegisteredSocities(res.societies);
  //     })
  //     .catch((err) => console.log(err));
  // };

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
            setRegisteredSocities(student.registered_societies);
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
  }, []);

  const handleSelectSociety = (id) => {
    console.log(id);
  };

  const procceedSelectedSociety = () => {
    fetch('/society/selected_societies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: context.userId,
        selected_societies: JSON.stringify(selected_societies),
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

  return (
    <div className="update_society_wrapper">
      <div className="registered_societies_info">
        <div className="societies">
          {societies &&
            societies.map((society) => {
              let color =
                registeredSocities && registeredSocities.length > 0
                  ? registeredSocities.includes(society._id)
                  : false;
              return (
                <div
                  key={society._id}
                  className="society"
                  className={
                    color
                      ? 'society selected'
                      : 'society not_selected'
                  }
                  onClick={() => handleSelectSociety(society._id)}
                >
                  {society.name}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SocietyUpdate;
