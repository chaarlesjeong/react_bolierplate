//express module 가져오기
const express = require("express");
//express app 생성, 포트 고정
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User");

//client에서 오는 정보를 분석해 가져오는 것: bodyParser
//application/x-www-form-urlencoded 형식 정보 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 형식 정보 가져옴
app.use(bodyParser.json());

const mongoose = require("mongoose");
const { mongoURI } = require("./config/dev");
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongoDB Connected"))
  .catch((error) => console.log(error));

//root directory에 오면 해당 내용 출력
app.get("/", (req, res) => res.send("Hello World!"));

app.post("/register", (req, res) => {
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

app.listen(port, () =>
  console.log(`Your app listening at http://localhost:${port}`)
);
