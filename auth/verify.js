const speakeasy = require("speakeasy");
const qrcode = require("qrcode");



async function verify(secret, token){
   return await speakeasy.totp.verify({
        secret,
        encoding: "ascii",
        token, //el codigo de google
      });
}
async function generateQr() {
  const secret = speakeasy.generateSecret({
    name: "Social Hub Manager",
  });
  let qr = await qrcode.toDataURL(secret.otpauth_url);
  return { secret: secret.ascii, qr };
}

module.exports = {
  generateQr,
  verify
};
