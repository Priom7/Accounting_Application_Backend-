const express = require("express");
const { check } = require("express-validator");

const groupsController = require("../controllers/groups-controllers");

const router = express.Router();

router.get("/", groupsController.getGroups);

router.post(
  "/addGroups",
  [check("name").not().isEmpty()],
  groupsController.addGroup
);

module.exports = router;
