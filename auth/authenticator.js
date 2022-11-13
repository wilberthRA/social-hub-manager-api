let userDB;
const { generateQr, verify } = require("./verify");
let twoFaDB;
module.exports = (injectedUserDB, injectedTwoFaDB) => {
  userDB = injectedUserDB;
  twoFaDB = injectedTwoFaDB;
  return {
    registerUser,
    login,
    twoFa,
    verify2fa,
  };
};

function registerUser(req, res) {
  userDB.isValidUser(req.body.username, (error, isValidUser) => {
    if (error || !isValidUser) {
      const message = error
        ? `Something went wrong!  ERROR: ${error}`
        : "This user already exists!";

      sendResponse(res, message, error);

      return;
    }

    userDB.register(req.body.username, req.body.password, (response) => {
      sendResponse(
        res,
        response.error === undefined ? "Success!!" : "Something went wrong!",
        response.error
      );
    });
  });
}

function login(query, res) {}

function sendResponse(res, message, error) {
  res.status(error !== undefined ? 400 : 200).json({
    message: message,
    error: error,
  });
}

async function twoFa(req, res) {
  let message = "user not valid";
  const user = await new Promise((resolve) => {
    userDB.getUser(req.body.username, req.body.password, (temp, response) => {
      resolve(response);
    });
  });
  if (user?.id) {
    const { id: secretId } = await twoFaDB.getSecretId(user?.id) || {};
    if (secretId) {
      res.status(200).json({id:secretId})
      return;
    }
    const { secret, qr } = await generateQr();
    const { id } = await twoFaDB.createTwofa(secret,user?.id);
    res.status(200).json({ id, qr });
    return;
  }
  res.status(401).json({ message });
}

async function verify2fa(req, res) {
    let message = "2fa not valid";
  const { id, token } = req?.body || {};
  const {secret} = await twoFaDB.getTwofaSecret(id);
  const isVerified = await verify(secret, token);
  if (isVerified) {
    message = "verified"
    res.status(200).json({ message });
    return;
  }
  res.status(401).json({ message });

}
