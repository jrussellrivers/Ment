const express = require("express");
const app = express();
const formidable = require("formidable");
const pgp = require("pg-promise")();

const eS = require("express-session");
const expressSession = eS({
  secret: "tghvbREGsdgwhwghwrggERgerBHerb",
  resave: false,
  saveUninitialized: false,
});

app.use(express.urlencoded({ extended: true }));
app.use(expressSession);

app.use(express.static("public"));

const connect = {
  host: "localhost",
  port: 5432,
  user: "priyankafarrell", //Put your name here for now
  database: "project_m",
};

const db = pgp(connect);
require("./api-routes")(app, db); //sets the api

app.post("/image-uploaded", (req, res) => {
  let form = {};

  //this will take all of the fields (including images) and put the value in the form object above
  new formidable.IncomingForm()
    .parse(req)
    .on("field", (name, field) => {
      form[name] = field;
    })
    .on("fileBegin", (name, file) => {
      //sets the path to save the image
      file.path =
        __dirname +
        "/public/profile_images/" +
        new Date().getTime() +
        file.name;
    })
    .on("file", (name, file) => {
      //console.log('Uploaded file', name, file);
      form.profile_image = file.path.replace(__dirname + "/public", " ");
    })
    .on("end", () => {
      console.log("your photo is uploaded!");
      console.log(form);
      //Now i can save the form to the database
      const results = db.none("insert into images (user_id, imgname) values ($1, $2)", [req.user.id, form.profile_image])
        .then((result) => console.log(result));

      res.send(form); //this just sends databack
    });
});
const port = 5434;

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

// module.exports = db
