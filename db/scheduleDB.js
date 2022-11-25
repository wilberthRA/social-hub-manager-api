let pgPool;

module.exports = (injectedPgPool) => {
  pgPool = injectedPgPool;

  return {
    createSchedule,
    isValidSchedule,
    getSchedulesByUser,
    deleteSchedule
  };
};

async function createSchedule(day, hour,userId) {
  const query = `INSERT INTO schedule (day,hour,user_id) VALUES ('${day}','${hour}','${userId}')`;

  const schedule = await new Promise((resolve) => {
    pgPool.query(query, (response) => {
      resolve(
        response.results && response.results.rowCount === 1
      );
    });
  });
  return schedule;
}

function isValidSchedule(day, hour, userId, cbFunc) {
  const query = `SELECT * FROM schedule WHERE day = '${day}' AND hour = '${hour}' AND user_id = '${userId}'`;

  const checkScheduleFunc = (response) => {
    const isValidSchedule = response?.results?.rowCount === 0;
    cbFunc(response.error, isValidSchedule);
  };

  pgPool.query(query, checkScheduleFunc);
}

async function getSchedulesByUser(userId) {
    const query = `select id, day, hour from schedule where user_id = ${userId}`;
  
    const schedule = await new Promise((resolve) => {
      pgPool.query(query, (response) => {
        resolve(
          response.results
        );
      });
    });
    return schedule;
  }

  async function deleteSchedule(scheduleId) {
    const query = `DELETE FROM schedule WHERE id = ${scheduleId}`;
    const schedule = await new Promise((resolve) => {
      pgPool.query(query, (response) => {
        resolve(
          response.results
        );
      });
    });
    return schedule;
  }
