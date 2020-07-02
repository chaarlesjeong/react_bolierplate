//express module 가져오기
const express = require("express");
//express app 생성, 포트 고정
const app = express();
const port = 3000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://scott:tiger@cluster0-0gyic.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("mongoDB Connected"))
  .catch((error) => console.log(error));

//root directory에 오면 해당 내용 출력
app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`Your app listening at http://localhost:${port}`)
);
