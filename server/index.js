//express module 가져오기
const express = require("express");
//express app 생성, 포트 고정
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//client에서 오는 정보를 분석해 가져오는 것: bodyParser
//application/x-www-form-urlencoded 형식 정보 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 형식 정보 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongoDB Connected"))
  .catch((error) => console.log(error));

app.get("/api/hello", (req, res) => res.send("Hello World!"));

app.post("/api/users/register", (req, res) => {
  //회원 가입 시 필요한 정보들을 client에서 가져온 뒤 DB에 넣어줌.
  //req.body:body-parser통해 json형식으로 정보 저장.
  const user = new User(req.body);
  user.save((error, userInfo) => {
    if (error) return res.json({ success: false, error });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //로그인 순서 - 요청된 이메일 DB에서 있는지 검색
  User.findOne({ email: req.body.email }, (error, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "email이 존재하지 않습니다.",
      });
    }

    //이메일 있으면 비번 같은지 확인
    user.comparePassword(req.body.password, (error, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀립니다.",
        });
      }
      //비번 같으면 user 위한 token 생성
      user.generateToken((error, user) => {
        if (error) return res.status(400).send(error);

        //Token 저장. Cookie or LocalStorage 등 선택 가능
        //Cookie 저장
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//Authentication - 사용자 인증(로그인 필요한 페이지에서, 로그인 되었는지 확인하기 위함)
//Callback Function이 잘 진행되는지 확인해주는 auth middleware
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 middleware 통과해 왔다는 건, Authentication이 True라는 뜻.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (error, user) => {
    if (error) return res.json({ success: false, error });
    return res.status(200).send({
      success: true,
    });
  });
});

const port = 5000;
app.listen(port, () =>
  console.log(`Your app listening at http://localhost:${port}`)
);
