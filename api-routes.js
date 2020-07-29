//To make your app.js look cleaner use this pattern
// import checkIsLoggedIn from 'public/js/checkIsLoggedIn.js'
// const db = require('./app')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const checkIsLoggedIn = require('./public/js/checkIsLoggedIn.js')
const checkIfExist = require('./public/js/checkIfExist.js')
const createUser = require('./public/js/createUser.js')
const createProfile = require('./public/js/createProfile.js')

const bcrypt = require('bcrypt')
const saltRounds = 10

const apiRoutes = (app, db)=>{
        //  use static here
    // app.use(express.static('public')) - create static folders for public, mentor, and mentee
    // app.get('/', (req, res)=> {
    //     res.render('./public/index.html')
    // })

    //  this function passed in the database to all routes/middleware
    const passInfo = (req, res, next) => {
        res.db = db
        res.saltRounds = saltRounds
        res.bcrypt = bcrypt
        next() 
    }

    app.use(passInfo)
    app.use(passport.initialize());
    app.use(passport.session());

    // seperate pg promise
    passport.use(new Strategy((username,password,callback)=>{
        // console.log(username, password)
        db.one(`SELECT * FROM users WHERE username='${username}'`)
        .then(u=>{
            console.log(u) //
            bcrypt.compare(password, u.password)
            .then(result=>{
                if(!result) return callback(null,false)
                return callback(null, u)
            })
            // return callback(null, u) // delete/comment this out later
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
    app.get(`/user/:id`, checkIsLoggedIn, async (req,res)=> {
        // createProfile(req.params.id,db)
        let userProfile = await createProfile(req.params.id, db)
        // this can be declared elsewhere...
        const showMenteeProfile = () => {
            res.render("mentee_profile", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.id}` + '</a>'
                }
            })
        }
        const showMentorProfile = () => {
            res.render("mentor_profile", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.id}` + '</a>'
                }
            })
        }

        console.log(userProfile)
        console.log(typeof userProfile.mentor)

        // userProfile.type == 'T' ? showMenteeProfile() : showMentorProfile()
        if (userProfile.mentor == false) {
            showMenteeProfile();
          } else if (userProfile.mentor == true) {
            showMentorProfile();
          } else {
            res.redirect('/');
          }
    })

    // change
    app.get('/login', (req,res)=>res.sendFile(__dirname + '/public/html/login.html'))


    // ternary for mentee or mentor, routes to user specific profile
    app.post('/login', passport.authenticate('local'), (req,res)=>{
        res.redirect(`/user/${req.user.id}`)
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

    // app.get(`/chat/:id`, async (req, res)=>{
    //     let sender = req.user
    //     let recipient_id = req.params.id
    //     let room_id = await checkChatRoom(sender, recipient_id, db)
    //     console.log(room_id)
    //     if (room_id == false){res.redirect(`/user/${req.params.id}`)}
    //     else{res.redirect(`/chat/${req.params.id}/${room_id}`)}
    // })
        
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
    
};
module.exports = apiRoutes;

//on app.js
//require("./api-routes")(app); //will load the routes

//you could alternatively use express.router if you want to do the research. should do this
