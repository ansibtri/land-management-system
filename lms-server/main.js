const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();


const port = 5000;

require("./config/db");


app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001","http://localhost:3002","http://localhost:3003"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(express.static("uploads"))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the LMS Server!');
});


app.use("/api/auth",require("./routes/auth.routes"));
app.use("/api/land", require("./routes/land.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/otp", require("./routes/otp.routes"));
app.use("/api/recommendation", require("./routes/recommendation.routes"))
app.use("/api/tax", require("./routes/tax.routes"));

app.listen(port,()=>{
    console.log(`LMS Server is running at http://localhost:${port}`);
})