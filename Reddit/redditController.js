const fetch = require('node-fetch');
var snoowrap = require('snoowrap');
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const auth = async(req,res) =>{
    try {
       const code = req.query.code;
       const clientId = "cyNLTKLq_fpqJJ9Zu1oTPg";
       const clientSecret = "abj7yAbWBBvHezdU1T6-W7bLzOa1hA";
       const encodedHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
       let response = await fetch(`https://www.reddit.com/api/v1/access_token`,{
           method: "POST",
            body: `grant_type=authorization_code&code=${code}&redirect_uri=http://127.0.0.1:3001/addnetwork`,
           headers: {authorization: `Basic ${encodedHeader}`, 'Content-Type':`application/x-www-form-urlencoded`}
        })
        let body = await response.json();
        console.log(body);
        res.json(body.access_token)
    } catch(e) {
       res.send({msg: "Something went wrong."})
    }
}
const makePost = async(req,res) =>{
    const r = new snoowrap({
        userAgent: 'Wika',
        accessToken: req.body.access_token
      });
      r.submitSelfpost({
        subredditName: 'wikaTest',
        title: req.body.title,
        text: req.body.text
      }).then((data) => {
        res.status(201).send({
          message: ReasonPhrases.CREATED,
          data: data
        })
      })

}

exports.makePost = makePost;
exports.auth = auth;