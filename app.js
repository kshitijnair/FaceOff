const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");

// GOOGLE AUTH PACKAGES
const { OAuth2Client } = require("google-auth-library");
const { json } = require("express");
const CLIENT_ID =
  "436174299251-lqthicfkr3idl5cjku1kgftnp3tbk5nq.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// function to take record of users
function recordUser(userData) {
  try {
    let time = new Date();
    timeLocal = time.toLocaleString("en-GB", { timezone: "IST" });
    fs.readFile("history.json", "utf-8", function (err, data) {
      if (err) throw err;
      let JSONdata = JSON.parse(data);
      JSONdata.logins.push({
        name: userData.name,
        email: userData.email,
        time: timeLocal,
      });
      console.log(JSONdata);
      fs.writeFile(
        "history.json",
        JSON.stringify(JSONdata, null, 2),
        "utf-8",
        function (err) {
          if (err) throw err;
          console.log("Done!");
        }
      );
    });
    console.log("User login details are saved in history.json");
  } catch (e) {
    console.log("error: ", e);
  }
}

// MIDDLEWARE

function validateAuth(req, res, next) {
  let token = req.cookies["session-token"];
  let userName;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    recordUser(payload);
    userName = payload.given_name;
  }
  verify()
    .then(() => {
      req.user = userName;
      next();
    })
    .catch(console.error);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// catch and print new request
// function printLog(req, res, next) {
//   console.log("Client made a new request...");
//   next();
// }
// app.use(printLog);

// GET landing page
app.get("/", (req, res) => {
  //   res.send("<h1>This is FaceMask homepage!</h1>");
  res.render("login.ejs");
});

// POST landing page
app.post("/", (req, res) => {
  const token = req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload.iss == "accounts.google.com" || "https://accounts.google.com")
      return "success";
    else "fail";
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      console.log("session-cookie is added...");
      res.send("success");
    })
    .catch((err) => {
      console.log(err);
      req.redirect("/");
    });
});

// GET mask loading page
app.get("/mask", validateAuth, (req, res) => {
  let user = req.user;
  res.render("mainMaskPage", { user: user });
});

// GET logout page
app.get("/logout", (req, res) => {
  res.clearCookie("session-token");
  res.redirect("/");
});

//start the server
app.listen(8080, () => {
  console.log("Listening for requests on PORT 3000...");
});
