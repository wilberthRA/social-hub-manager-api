let pgPool;

module.exports = (injectedPgPool) => {
  pgPool = injectedPgPool;

  return {
    createTwofa,
    getTwofaSecret,
    getSecretId
  };
};

async function getSecretId(user_id) {
  const query = `SELECT id FROM two_fa WHERE user_id = ${user_id}`;

  const secretId = await new Promise((resolve) => {
    pgPool.query(query, (response) => {
      resolve(
        response.results && response.results.rowCount === 1
          ? response.results.rows[0]
          : null
      );
    });
  });
  return secretId;
}

async function createTwofa(secret, user_id) {
  const query = `INSERT INTO two_fa (secret,user_id) VALUES ('${secret}','${user_id}') RETURNING id;`;

  const secretId = await new Promise((resolve) => {
    pgPool.query(query, (response) => {
      resolve(
        response.results && response.results.rowCount === 1
          ? response.results.rows[0]
          : null
      );
    });
  });
  return secretId;
}

async function getTwofaSecret(id) {
  const getSecreteQuery = `SELECT secret FROM two_fa WHERE id = '${id}'`;

  const secret = await new Promise((resolve) => {
    pgPool.query(getSecreteQuery, (response) => {
      resolve(
        response.results && response.results.rowCount === 1
          ? response.results.rows[0]
          : null
      );
    });
  });

  return secret;
}
