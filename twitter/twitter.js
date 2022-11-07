const {TwitterApi} = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: 'tStoOvXfkTTOlQ1ITXnLdg5io',
    appSecret: 'NPsmI1cGTQMcEEMxq1S6T4amoi4M2RA9yyOOtSFX4pXDJCMgKj',
    accessToken: '1562581399621685249-EzuEvdfb97znBZtPBbt25e4cIpQy9w',
    accessSecret: 'xu6dltmNLjnGVFT0bAh5BKiWN01ZkNQyeZggTXjfQXAGv',
});

client.v1.tweet('This tweet was written by a bot').then((val) => {
  console.log(val)
  console.log("success")
}).catch((err) => {
  console.log(err)
})
