const express = require('express');
const app = express();
const secretInfo = require('./config.js')
const pgp = require('pg-promise')()
const eS = require('express-session')
const expressSession = eS(secretInfo().secret)

const formidable = require("formidable");
const es6Renderer = require('express-es6-template-engine');


app.use(express.urlencoded({extended: true}))
app.use(expressSession)
app.engine("html", es6Renderer)
app.set("views", "templates")
app.set("view engine", "html")


app.use(express.static("public"));


const db = pgp(secretInfo().connect)
require("./api-routes")(app, db);//sets the api

const port = 5434;

app.listen(port, ()=>{
    console.log(`listening on http://localhost:${port}`)
})

// module.exports = db
