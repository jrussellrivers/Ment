const express = require('express');
const app = express();
const es6Renderer = require('express-es6-template-engine');
const connect = require('./config.js')

const pgp = require('pg-promise')()

const eS = require('express-session')
const expressSession = eS({secret:'tghvbREGsdgwhwghwrggERgerBHerb', resave: false, saveUninitialized: false})

app.use(express.urlencoded({extended: true}))
app.use(expressSession)
app.engine("html", es6Renderer)
app.set("views", "templates")
app.set("view engine", "html")




app.use(express.static("public"));

const connect = {
    host:'localhost',
    port:5432,
    user:'David', //Put your name here for now
    database:'project_m'
}


const db = pgp(connect)
require("./api-routes")(app, db);//sets the api

const port = 5434;

app.listen(port, ()=>{
    console.log(`listening on http://localhost:${port}`)
})

// module.exports = db