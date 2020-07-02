const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    //space를 없애주는 역할:trim
    trim: true,
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
  } else next();
});

// schema를 감싸주는 model
const User = mongoose.model("User", userSchema);

//다른 곳에서 사용 가능하게 Export
module.exports = { User };
