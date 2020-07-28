const express = require('express');
const app = express();
require("./api-routes")(app);//sets the api
const pgp = require('pg-promise')()

const eS = require('express-session')
const expressSession = eS({secret:'tghvbREGsdgwhwghwrggERgerBHerb', resave: false, saveUninitialized: false})

app.use(express.urlencoded({extended: true}))
app.use(expressSession)

app.use(express.static("public"));

const connect = {
    host:'localhost',
    port:5432,
    user:'jordanrivers', //Put your name here for now
    database:'project_m'
}

const db = pgp(connect)

const port = 5434;

app.listen(port, ()=>{
    console.log(`listening on http://localhost:${port}`)
})