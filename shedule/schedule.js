const pgPool = require("../db/pgWrapper");
const tokenDB = require("../db/tokenDB")(pgPool);

let scheduleDB;
module.exports = (injectedScheduleDB) => {
  scheduleDB = injectedScheduleDB;
  return {
    registerSchedule,
    getSchedules,
    deleteSchedule
  };
};

function sendResponse(res, message, error) {
  res.status(error !== undefined ? 400 : 200).json({
    message: message,
    error: error,
  });
}

async function registerSchedule(req, res) {
  let barerToken = req.headers.authorization;
  barerToken = barerToken.substring(7, barerToken.length);
  const userId = await tokenDB.getUserIDFromBearerToken2(barerToken);

  scheduleDB.isValidSchedule(
    req.body.day,
    req.body.hour,
    userId,
    async (error, isValidSchedule) => {
      if (error || !isValidSchedule) {
        const message = error
          ? `Something went wrong!  ERROR: ${error}`
          : "This schedule already exists!";
        sendResponse(res, message, error);
        return;
      }
      const schedule = await scheduleDB.createSchedule(
        req.body.day,
        req.body.hour,
        userId
      );
      sendResponse(res, schedule ? "Created!" : "Something went wrong!");
      return;
    }
  );
}

async function getSchedules(req, res) {
  let barerToken = req.headers.authorization;
  barerToken = barerToken.substring(7, barerToken.length);
  const userId = await tokenDB.getUserIDFromBearerToken2(barerToken);

  const schedules = await scheduleDB.getSchedulesByUser(userId);

  sendResponse(res, schedules ? schedules.rows : "Something went wrong!");
  return;
}

async function deleteSchedule(req, res) {
  const scheduleDeleted = await scheduleDB.deleteSchedule(req.params?.id);

  sendResponse(res, scheduleDeleted ? "deleted" : "Something went wrong!");
  return;
}
