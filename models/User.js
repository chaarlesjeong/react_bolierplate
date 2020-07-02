const mongoose = require("mongoose");

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

// schema를 감싸주는 model
const User = mongoose.model("User", userSchema);

//다른 곳에서 사용 가능하게 Export
module.exports = { User };
