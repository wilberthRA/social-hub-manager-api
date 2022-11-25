// Database imports
const pgPool = require("./db/pgWrapper");
const tokenDB = require("./db/tokenDB")(pgPool);
const userDB = require("./db/userDB")(pgPool);
const twoFaDB = require("./db/twoFaDB")(pgPool);
// OAuth imports
const oAuthService = require("./auth/tokenService")(userDB, tokenDB);
const oAuth2Server = require("node-oauth2-server");
// API imports
const TwitterApi = require("./twitter/twitterRoutes");
const RedditApi = require("./Reddit/redditRoutes");
// Express
const express = require("express");
const app = express();
app.oauth = oAuth2Server({model: oAuthService,grants: ["password"],debug: true,});
const testAPIService = require("./test/testAPIService.js");
const testAPIRoutes = require("./test/testAPIRoutes.js")(express.Router(),app,testAPIService);
// Auth and const cors = require("cors");
const authenticator = require("./auth/authenticator")(userDB,twoFaDB);
const routes = require("./auth/routes")(express.Router(),app,authenticator);
// CORS
const cors = require("cors");
//Postgres
const {Client} = require('pg');


const client = new Client({
    host: "localhost",
    port : 5432,
    user: "root",
    password: "root",
    database: "logrocket_oauth2"
})

client.connect();

let query = `Select * from "Users"`;

client.query(query, (err, res)=>{
    if(!err){
        console.log(res.rows);
    } else{
        console.log(err.message)
    }
    client.end;
})

const corsOptions = [{
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false},{
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  }];

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(app.oauth.errorHandler());
app.use("/auth", routes);
app.use("/test", testAPIRoutes);
app.use("/twitter", TwitterApi);
app.use("/reddit",RedditApi);
const port = 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});