const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    //space를 없애주는 역할:trim
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  //역할을 숫자로 나눔:role
  role: {
    type: Number,
    default: 0,
  },
  image: String,

  token: {
    type: String,
  },
  //token exprie date
  tokenExp: {
    type: Number,
  },
});

//userModel에 정보 저장(user.save) 전 동작
userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (error, salt) {
      if (error) return next(error);
      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
    //암호화 시키고 나가도록 해야 함
  } else next();
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  //plainpassword 1234567 암호화된 비밀번호 $2b$10$vwY0IdcCU4BxQ2gA9XZVsuYSS/i0mK7ZoIHGe/8HLf6.6t2hNxuSC
  //같은지 체크 하려면 일반 비번을 암호화한 뒤에, 이미 암호화된거와 체크(복호화는 안됨)
  bcrypt.compare(plainPassword, this.password, function (error, isMatch) {
    if (error) return callback(error);
    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callback) {
  //jsonWebToken 이용 Token 생성
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (error, user) {
    if (error) return callback(error);
    callback(null, user);
  });
};

userSchema.statics.findByToken = function (token, callback) {
  //Token Decoding
  let user = this;
  jwt.verify(token, "secretToken", function (error, decoded) {
    //유저 아이디 이용해 유저 찾은 후,
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일지하는지 확인.
    user.findOne({ _id: decoded, token: token }, function (error, user) {
      if (error) return callback(error);
      callback(null, user);
    });
  });
};

// schema를 감싸주는 model
const User = mongoose.model("User", userSchema);

//다른 곳에서 사용 가능하게 Export
module.exports = { User };
