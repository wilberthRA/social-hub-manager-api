const {TwitterApi} = require('twitter-api-v2');
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
/* const express = require("express");
const app = express(); */
const CLIENT_ID = "QUR2ZUsxSTZUZm0yUFZBTWg2aWI6MTpjaQ";
const CLIENT_SECRET = "ybJAVC8ec7e4MuUJysEyEVlYtqBcFBlg0A9RvQXwGOOMQdj2w3";

const CALLBACK_URL = "http://127.0.0.1:3001/addnetwork";

const url = async(req,res)=>{
  const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

 const { url, codeVerifier, state } = client.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', 'offline.access','tweet.write'] });
 var data = {
  link: url, codigo: codeVerifier, estado: state
 };
 estado = state;
 verificado = codeVerifier;
 res.json(data)
}

const auth = async (req, res) => {
  // Extract state and code from query string
  let code = req.body.code;
  let state = req.body.state;
  console.log("code "+ code);
  console.log("state "+ state);
  // Get the saved codeVerifier from session
  let codeVerifier = req.body.codeVerifier;
  let sessionState = req.body.sessionState;
  console.log("codeVerifier " +codeVerifier);
  console.log("sessionState " +sessionState);

  if (!codeVerifier || !state || !sessionState || !code) {
    return res.json({message: 'You denied the app or your session expired!'});
  }
  if (state !== sessionState) {
    return res.json('Stored tokens didnt match!');
  }

  // Obtain access token
  const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });
  
  client.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
    .then(async ({ client: loggedClient, accessToken, refreshToken }) => {
      // {loggedClient} is an authenticated client in behalf of some user
      // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
      // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

      const data = {
        token: accessToken,
        refresh: refreshToken
      }
      res.json(data)

    })
    .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
};

const makePost = async (req,res)=>{
  const client = new TwitterApi(req.body.access_token);
  await client.v2.tweet(req.body.text).then((data) => {
    res.status(201).send({
      message: ReasonPhrases.CREATED,
      data: data
    })
    
  }).catch((err) => {
    res.status(404).send('Not Found');
  });
};

exports.makePost = makePost;
exports.auth = auth;
exports.url = url;