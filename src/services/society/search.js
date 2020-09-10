const Society = require("../../models/society");

exports.getSearchResults = async ({ registered_societies, searchVal }) => {
  const societies = await Society.find({
    _id: registered_societies,
  });

  if (!societies) {
    return {
      message: "No societies found",
      status: 404,
    };
  }

  let events = [];
  let notices = [];

  for (let society of societies) {
    for (let ev of society.events) {
      events.push(ev);
    }
    for (let nt of society.notices) {
      notices.push(nt);
    }
  }

  const events_result = events.filter((ev) =>
    ev.title.toLowerCase().includes(searchVal.toLowerCase())
  );
  const notices_result = notices.filter((nt) =>
    nt.title.toLowerCase().includes(searchVal.toLowerCase())
  );

  return {
    events_result,
    notices_result,
  };
};
