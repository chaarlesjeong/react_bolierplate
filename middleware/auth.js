const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증 처리 하는 곳
  //1. Client에서 Cookie 가져오기
  let token = req.cookies.x_auth;
  //2. Token 복호화 한 후 유저 찾아보기
  User.findByToken(token, (error, user) => {
    if (error) throw error;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
  //유저 있으면 인증 OK, 없으면 인증 NO
};
module.exports = { auth };
