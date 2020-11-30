const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const societyController = require("../controllers/society");

router.get("/get_societies", societyController.fetchSocieties);
router.post(
  "/search_events_notices/",
  checkAuth,
  societyController.getSearchResults
);

router.post("/get_details", checkAuth, societyController.getDetails);
router.post("/fetch_joined_events", checkAuth, societyController.fetchJoinedEvents);

router.post(
  "/registered_societies",
  checkAuth,
  societyController.getRegisteredSocieties
);
router.post(
  "/selected_societies",
  checkAuth,
  societyController.saveSelectedSocieties
);
router.post(
  "/update_registered_society",
  checkAuth,
  societyController.updateRegisteredSociety
);
router.post("/handle_join_request", checkAuth, societyController.updateJoinRequest);

module.exports = router;
