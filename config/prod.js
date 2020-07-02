//Heroku 등에서 변수 사용시, MONGO_URI로 설정할 것
module.exports = {
  mongoURI: process.env.MONGO_URI,
};
