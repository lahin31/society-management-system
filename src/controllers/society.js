const Society = require("../models/society");
const Student = require("../models/student");

const SocietyService = require("../services/society/society");
const SearchService = require("../services/society/search");

exports.fetchSocieties = async (req, res) => {
  try {
    const fetchSocieties_service = await SocietyService.fetchSocieties();
    const { societies } = fetchSocieties_service;

    res.status(200).json({
      societies,
    });
  } catch (err) {
    res.status(500);
  }
};

exports.getRegisteredSocieties = async (req, res) => {
  try {
    const societies_id = JSON.parse(req.body.societies);
    const getRegisteredSocieties_service = await SocietyService.getRegisteredSocieties(
      { societies_id }
    );
    const { registered_societies } = getRegisteredSocieties_service;

    res.status(200).json({
      registered_societies,
    });
  } catch (err) {
    res.status(500);
  }
};

exports.saveSelectedSocieties = async (req, res) => {
  try {
    const userId = req.body.userId;
    const selected_societies = JSON.parse(req.body.selected_societies);

    if (!userId) {
      return res.status(401).json({
        error: "Valid user id or student id needed",
      });
    }

    const saveSelectedSocieties_service = await SocietyService.saveSelectedSocieties(
      { userId, selected_societies }
    );

    if (saveSelectedSocieties_service.status === 404) {
      const { error } = saveSelectedSocieties_service;
      return res.status(500).json({
        error,
      });
    }

    const { message, student } = saveSelectedSocieties_service;

    res.status(200).json({
      message,
      student,
    });
  } catch (err) {
    res.status(500);
  }
};

exports.updateRegisteredSociety = async (req, res) => {
  try {
    const {
      follow_unfollow_result: followUnfollowRequest,
      society_id: societyId,
      student_id,
    } = req.body;

    const updateRegisteredSociety_service = await SocietyService.updateRegisteredSociety(
      {
        student_id,
        societyId,
        followUnfollowRequest,
      }
    );

    const { message } = updateRegisteredSociety_service;

    if (updateRegisteredSociety_service.status === 404) {
      return res.status(404).json({
        message,
      });
    }

    res.status(200).json({ message });
  } catch (err) {
    res.status(500);
  }
};

exports.getDetails = async (req, res) => {
  try {
    const society_id = req.body.society_id;

    if (!society_id) {
      return res.status(401).json({
        message: "Society id is required",
      });
    }

    const getDetails_service = await SocietyService.getSocietyDetails({
      society_id,
    });

    if (getDetails_service.status === 404) {
      const { message } = getDetails_service;
      return res.status(404).json({
        message,
      });
    }

    res.status(200).json({
      society_id: getDetails_service.society_id,
      society: getDetails_service.society,
      members: getDetails_service.members
    });
  } catch (err) {
    res.status(500);
  }
};

exports.getSearchResults = async (req, res) => {
  try {
    const searchVal = req.body.searchVal;
    const registered_societies = req.body.registered_societies;

    const getSearchResults_service = await SearchService.getSearchResults({
      registered_societies,
      searchVal,
    });

    if (getSearchResults_service.status === 404) {
      const { message } = getSearchResults_service;
      return res.status(404).json({
        ...(message && message),
      });
    }

    const { events_result, notices_result } = getSearchResults_service;

    res.status(200).json({
      searchVal,
      events_result,
      notices_result,
    });
  } catch (err) {
    res.status(500);
  }
};

exports.updateJoinRequest = async (req, res) => {
  try {
    const {
      join_result: joinRes,
      society_id: societyId,
      event_id: eventId,
      user_id: userId
    } = req.body;

    const society = await Society.findById({ _id: societyId });

    if(joinRes === "Going") {
      if(society) {
        let events = society.events;
        let event = society.events.filter(ev => String(ev._id) === eventId);

        event[0].registered_members.push(userId)

        await Society.updateOne(
          { _id: societyId }, 
          {
            $set: {
              events
            }
          }
        )

        await Student.updateOne(
          { _id: userId },
          {
            $push: {
              joined_events: {
                society_id: societyId, event_id: eventId
              }
            }
          }
        )

        res.status(200).json({
          message: "updated"
        })
      }

    } else if(joinRes === "Not Going") {

        if(society) {
          let events = society.events;
          let event = society.events.filter(ev => String(ev._id) === eventId);

          let reg_mem_index = event[0].registered_members.findIndex(mem => mem === userId);
          
          event[0].registered_members.splice(reg_mem_index, 1);

          await Society.updateOne(
            { _id: societyId }, 
            {
              $set: {
                events
              }
            }
          );

          const student = await Student.findById({ _id: userId });
          let del_event_index = student.joined_events.findIndex(j_ev => j_ev.event_id === eventId);
          student.joined_events.splice(del_event_index, 1);

          await Student.updateOne(
            { _id: userId }, 
            {
              $set: {
                joined_events: student.joined_events
              }
            }
          );

          res.status(200).json({
            message: "updated"
          })
        }
      }

  } catch (err) {
    res.status(500);
  }
}

exports.fetchJoinedEvents = async (req, res) => {
  try {
    const joinedEvents = JSON.parse(req.body.joined_events);
    const events = [];

    for(let ev of joinedEvents) {
      let society = await Society.findById({ _id: ev.society_id })
      let event = society.events.filter(evnt => String(evnt._id) === ev.event_id);
      events.push(event)
    }

    res.status(200).json({
      events
    })
  } catch(err) {
    res.status(500);
  }
}