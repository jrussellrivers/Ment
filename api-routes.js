//To make your app.js look cleaner use this pattern
// import checkIsLoggedIn from 'public/js/checkIsLoggedIn.js'
const db = require('./app')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const checkIsLoggedIn = require('./public/js/checkIsLoggedIn.js')
const checkIfExist = require('./public/js/checkIfExist.js')
const createUser = require('./public/js/createUser.js')

const bcrypt = require('bcrypt')
const saltRounds = 10

const apiRoutes = (app)=>{

        //  use static here
    // app.use(express.static('public')) - create static folders for public, mentor, and mentee
    // app.get('/', (req, res)=> {
    //     res.render('./public/index.html')
    // })
    
    app.use(passport.initialize());
    app.use(passport.session());

    // seperate pg promise
    passport.use(new Strategy((username,password,callback)=>{
        db.one(`SELECT * FROM users WHERE username='${username}'`)
        .then(u=>{
            console.log(u)
            bcrypt.compare(password, u.password)
            .then(result=>{
                if(!result) return callback(null,false)
                return callback(null, u)
            })
        })
        .catch(()=>callback(null,false))
    }))

    passport.serializeUser((user,callback)=>callback(null, user.id))

    passport.deserializeUser((id,callback)=>{
        db.one(`SELECT * FROM users WHERE id='${id}'`)
        .then(u=>{
            return callback(null,u)
        })
        .catch(()=>callback({'not-found':'No User With That ID Is Found'}))
    })

    // this needs to route to authenticated pages.
    // login needs to be changed. find way to serve public website first, then only upon attempt to login
    // authenticate and attempt to serve mentor/mentee routing

    // change
    app.get('/mentor', checkIsLoggedIn, (req,res)=>res.send(`You are Authenticated : ${req.user.username}
    <br><a href="/logout">Logout</a>`))
    // change
    app.get('/login', (req,res)=>res.sendFile(__dirname + '/public/html/login.html'))
    // change

    // ternary for mentee or mentor, routes to user specific profile
    app.post('/login', passport.authenticate('local'), (req,res)=>{
        res.redirect('/')
    })
    // this is correct.
    app.get('/register', (req,res)=>res.sendFile(__dirname + '/public/html/register.html'))

    // this is correct.
    app.post('/register', checkIfExist, createUser, (req,res)=>{
        res.redirect('/login')
    })
    // look into how to implement this
    app.get('/logout', (req,res)=>{
        req.logout()
        res.redirect('/login')
    })
    
};
module.exports = apiRoutes;

//on app.js
//require("./api-routes")(app); //will load the routes

//you could alternatively use express.router if you want to do the research. should do this