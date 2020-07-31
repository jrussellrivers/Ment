//To make your app.js look cleaner use this pattern
// import checkIsLoggedIn from 'public/js/checkIsLoggedIn.js'
// const db = require('./app')
const passport = require('passport')
const formidable = require("formidable");
const Strategy = require('passport-local').Strategy
const fs = require('fs')
const checkIsLoggedIn = require('./public/js/checkIsLoggedIn.js')
const checkIfExist = require('./public/js/checkIfExist.js')
const createUser = require('./public/js/createUser.js')
const createProfile = require('./public/js/createProfile.js')
const getPhoto = require('./public/js/getPhoto.js')
<<<<<<< HEAD
const findMents = require('./public/js/findMents.js')
=======
>>>>>>> origin/master
const findMentsPic = require('./public/js/findMentsPic.js')
const checkChatRoom = require('./public/js/checkChatRoom.js')
const renderChatRoom = require('./public/js/renderChatRoom.js')
const makeMessage = require('./public/js/makeMessage.js')
const getUrl = require('./public/js/getUrl.js')
<<<<<<< HEAD
=======
const makeConnection = require('./public/js/makeConnection.js')
const checkLoggedUser = require('./public/js/checkLoggedUser.js')
const returnUsername = require('./public/js/returnUsername')
const renderConnections = require('./public/js/renderConnections.js')
>>>>>>> origin/master

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

    app.get(`/user/:id`, checkIsLoggedIn, async (req,res)=> {
        // createProfile(req.params.id,db)
        let userProfile = await createProfile(req.params.id, db)
        // this can be declared elsewhere...
<<<<<<< HEAD
        let picture = await getPhoto(req.params.id, db)
        const showMenteeProfile = async () => {
            res.render("mentee_profile", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: picture,
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>'
                }
            })
        }
        const showMentorProfile = async () => {
            res.render("mentor_profile", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: picture,
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>'
=======
        const showMenteeProfile = (connections) => {
            res.render("mentee_profile", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                // chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>',
                chatlink:`<form action="/chat/${userProfile.id}" method="get">
                                <button type="submit">Chat with ${userProfile.username}</button>
                            </form>`,
                connectbutton: `<form action="/user/${req.params.id}/connect" method="get">
                                    <button type="submit">Connect with ${userProfile.username}</button>
                                </form>`,
                connectionslist: connections
                }
            })
        }
        const showMentorProfile = (connections) => {
            res.render("mentor_profile", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                // chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>',
                chatlink:`<form action="/chat/${userProfile.id}" method="get">
                                <button type="submit">Chat with ${userProfile.username}</button>
                            </form>`,
                connectbutton: `<form action="/user/${req.params.id}/connect" method="get">
                                    <button type="submit">Connect with ${userProfile.username}</button>
                                </form>`,
                connectionslist: connections
>>>>>>> origin/master
                }
            })
        }

        // userProfile.type == 'T' ? showMenteeProfile() : showMentorProfile()
        if (userProfile.mentor == false) {
<<<<<<< HEAD
            showMenteeProfile();
          } else if (userProfile.mentor == true) {
            showMentorProfile();
          } else {
            res.redirect('/');
          }
    })
    var new_cards = undefined
    app.get(`/lobby`, checkIsLoggedIn, (req,res)=> {
        // show boilerplate lobby first which includes a post form for the search.

=======
            let connections = await renderConnections(db, userProfile)
            showMenteeProfile(connections);
        } else if (userProfile.mentor == true) {
            let connections = await renderConnections(db, userProfile)
            showMentorProfile(connections);
        } else {
        res.redirect('/');
        }
    })
    var new_cards = undefined
    app.get(`/lobby`, checkIsLoggedIn, (req,res)=> {
>>>>>>> origin/master
        if (new_cards == undefined){
            new_cards = ''
            res.render("lobby", {
                locals: {
                cards: new_cards,
                user: req.user || {type:"N/A",username:"N/A"},
                }
            })
        }else{
        res.render("lobby", {
            locals: {
            cards: new_cards,
            user: req.user || {type:"N/A",username:"N/A"},
            }
        })
        }
    })

    app.post(`/lobby`, checkIsLoggedIn, async (req, res)=> {
        let category = req.body.search
        let searchQ = req.body.SearchQuery
        let url = getUrl(req)
        let result = await findMentsPic(req.user, category, searchQ, db, url);
        new_cards = result
        res.redirect('/lobby')
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

<<<<<<< HEAD
    // app.get(`/chat/:id`, async (req, res)=>{
    //     let sender = req.user
    //     let recipient_id = req.params.id
    //     let room_id = await checkChatRoom(sender, recipient_id, db)
    //     console.log(room_id)
    //     if (room_id == false){res.redirect(`/user/${req.params.id}`)}
    //     else{res.redirect(`/chat/${req.params.id}/${room_id}`)}
    // })
=======
>>>>>>> origin/master

    app.get('/photos/:id', async (req, res)=> {
        let pic = await getPhoto(req.params.id, db)
        console.log(pic, "167")
        // for now
        pic = 'default.jpg'
        res.sendFile(__dirname + '/public/profile_images/'+pic)
    })


    app.post("/image-uploaded", checkIsLoggedIn, async (req, res) => {
    let form = {};

    //this will take all of the fields (including images) and put the value in the form object above
    new formidable.IncomingForm()
        .parse(req)
        .on("field", (name, field) => {
        form[name] = field;
        })
        .on("fileBegin", (name, file) => {
        //sets the path to save the image
        let filepath =
            __dirname +
            "/public/profile_images/" +
            new Date().getTime() +
            file.name;
            file.path = filepath.replace(/\s/g, '')
        })
        .on("file", (name, file) => {
        //console.log('Uploaded file', name, file);
        // new_path = file.path.split().join("")
        // new_path = file.path.replace(/\s/g, '')
        console.log("187", file.path)
        form.profile_image = file.path.replace(__dirname + "/public", "");
        console.log(form.profile_image)
        })

        .on ("end", async () => {
            console.log("your photo is uploaded!");
            
        //Now i can save the form to the database
            let pid = req.user.id
            let newimageaddress= '<img src="' + form.profile_image + '"'
            let checkphoto = await db.one(`SELECT imgname FROM images WHERE user_id ='${pid}'`)
            console.log(checkphoto.imgname, "199")

            if (checkphoto.imgname != '<img src="/profile_images/default.jpg">')
            {
                console.log(form.profile_image, "203")
                console.log(checkphoto.imgname, "204")
                let file = checkphoto.imgname.replace('<img src="', '').replace('">', '').replace('"', '')
                console.log(file, "206")
                if(fs.existsSync('./public' + file))
                {fs.unlinkSync('./public' + file)}
                // if(fs.existsSync('./public' + form.profile_image))
                // {fs.unlinkSync('./public' + form.profile_image)}
            }
            console.log(newimageaddress)
            let result = await db.none(`UPDATE images set imgname = '${newimageaddress}' where user_id = '${pid}'`)
            res.json({"url": `/user/${req.user.id}`})
            // res.send(result)
            });
    });
    
    app.get('/chat/:id', checkIsLoggedIn, async (req, res)=>{
        let sender = req.user
        let recipient_id = req.params.id
        let room_id = await checkChatRoom(sender, recipient_id, db)
        if (room_id == false){res.redirect(`/user/${req.params.id}`)}
        else{res.redirect(`/chat/room/${room_id}`)}
    })
    
<<<<<<< HEAD
    app.get('/chat/room/:id', checkIsLoggedIn, async (req,res) =>{
=======
    app.get('/chat/room/:id', async (req,res) =>{
        let return_id = await checkLoggedUser(db, req.user.id, req.params.id)
>>>>>>> origin/master
        let messages = await renderChatRoom(db, req.params.id)
        let return_username = await returnUsername(db, return_id)
        res.render("chat_room", {
            locals: {
<<<<<<< HEAD
=======
            return_link:'href="/user/' + return_id + '"',
            return_username: return_username,
>>>>>>> origin/master
            room_id:req.params.id,
            messages: messages,
            actionstring:'action="/chat/room/' + req.params.id + '"'
            }
        })
    })

    app.post('/chat/room/:id', checkIsLoggedIn, async (req,res) =>{
        await makeMessage(db, req.body.messageinput, req.user.username, req.params.id)
        res.redirect(`/chat/room/${req.params.id}`)
    })

    app.get('/user/:id/connect', async (req,res)=>{
        let connect = await makeConnection(db, req.params.id, req.user)
        if (connect == false){
            console.log('Connection already made')
        } else{
            console.log('Connection made succesfully')
        }
        res.redirect(`/user/${req.params.id}`)
    })
};
module.exports = apiRoutes;

//on app.js
//require("./api-routes")(app); //will load the routes

//you could alternatively use express.router if you want to do the research. should do this
