const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Group = require("../models/group");

const getGroups = async (req, res, next) => {
  let groups;
  try {
    groups = await Group.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching groups failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    groups: groups.map((group) =>
      group.toObject({ getters: true })
    ),
  });
};

const addGroup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check your data.",
        422
      )
    );
  }
  const { name } = req.body;

  let existingGroup;
  try {
    existingGroup = await Group.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      "Adding failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingGroup) {
    const error = new HttpError(
      "Group exists already, please login instead.",
      422
    );
    return next(error);
  }

  const createdGroup = new Group({
    name,
    accounts: [],
  });

  try {
    await createdGroup.save();
  } catch (err) {
    const error = new HttpError(
      "Adding failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    user: createdGroup.toObject({ getters: true }),
  });
};

(exports.getGroups = getGroups),
  (exports.addGroup = addGroup);
