//To make your app.js look cleaner use this pattern
// import checkIsLoggedIn from 'public/js/checkIsLoggedIn.js'

const passport = require('passport')
const Strategy = require('passport-local').Strategy
const checkIsLoggedIn = require('./public/js/checkIsLoggedIn.js')
const checkIfExist = require('./public/js/checkIfExist.js')
const createUser = require('./public/js/createUser.js')

const bcrypt = require('bcrypt')
const saltRounds = 10

const apiRoutes = (app)=>{
    
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Strategy((username,password,callback)=>{
        db.one(`SELECT * FROM users WHERE username='${username}'`)
        .then(u=>{
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

    app.get('/', checkIsLoggedIn, (req,res)=>res.send(`You are Authenticated : ${req.user.username}
    <br><a href="/logout">Logout</a>`))

    app.get('/login', (req,res)=>res.sendFile(__dirname + '/login.html'))

    app.post('/login', passport.authenticate('local'), (req,res)=>{
        res.redirect('/')
    })

    app.get('/register', (req,res)=>res.sendFile(__dirname + '/register.html'))

    app.post('/register', checkIfExist, createUser, (req,res)=>{
        res.redirect('/login')
    })

    app.get('/logout', (req,res)=>{
        req.logout()
        res.redirect('/login')
    })
    
};
module.exports = apiRoutes;

//on app.js
//require("./api-routes")(app); //will load the routes

//you could alternatively use express.router if you want to do the research.