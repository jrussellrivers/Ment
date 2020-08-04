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
const findMentsPic = require('./public/js/findMentsPic.js')
const checkChatRoom = require('./public/js/checkChatRoom.js')
const renderChatRoom = require('./public/js/renderChatRoom.js')
const makeMessage = require('./public/js/makeMessage.js')
const getUrl = require('./public/js/getUrl.js')
const makeConnection = require('./public/js/makeConnection.js')
const checkLoggedUser = require('./public/js/checkLoggedUser.js')
const returnUsername = require('./public/js/returnUsername')
const renderConnections = require('./public/js/renderConnections.js')
const renderSkills = require('./public/js/renderSkills.js')
const updateSkills = require('./public/js/updateSkills.js')
const renderView = require('./public/js/renderView.js')
const grabAllUserChats = require('./public/js/grabAllUserChats.js')
const grabOnlineUsers = require('./public/js/grabOnlineUsers.js')


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

    app.get(`/user/:id`, checkIsLoggedIn, renderView, async (req,res)=> {
        // middlware should handle everything here.
    })

    var new_cards = undefined;
    app.get(`/lobby`, checkIsLoggedIn, async (req,res)=> {
        let online_users = grabOnlineUsers(req)
        let user_chats = await grabAllUserChats(db, req.user, online_users)
        if (new_cards == undefined){
            new_cards = ''
            res.render("lobby", {
                locals: {
                    myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                    chatrooms: user_chats,
                    cards: new_cards,
                    user: req.user || {type:"N/A",username:"N/A"},
                }
            })
        }else{
        res.render("lobby", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                chatrooms: user_chats,
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

    app.post('/skills/:id', checkIsLoggedIn, async (req, res)=> {
        await updateSkills(db, req.params.id, req.body.skill)
        res.redirect(`/user/${req.params.id}`)
    })

    
    app.get('/login', (req,res)=>res.sendFile(__dirname + '/public/html/login.html'))


    
    app.post('/login', passport.authenticate('local'), (req,res)=>{
        res.redirect(`/user/${req.user.id}`)
    })
    
    app.get('/register', (req,res)=>res.sendFile(__dirname + '/public/html/register.html'))


    app.post('/register', checkIfExist, createUser, (req,res)=>{
        res.redirect('/login')
    })
    
    app.get('/logout', (req,res)=>{
        req.logout()
        res.redirect('/login')
    })


    app.get('/photos/:id', checkIsLoggedIn, async (req, res)=> {
        let pic = await getPhoto(req.params.id, db)
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
        console.log("203", file.path)
        form.profile_image = file.path.replace(__dirname + "/public", "");
        console.log(form.profile_image)
        })

        .on ("end", async () => {
            let pid = req.user.id
            let cut = form.profile_image.indexOf('s')+2
            let newimageaddress= form.profile_image.substring(cut)
            let oldImage = await db.one(`SELECT imgname FROM images WHERE user_id ='${pid}'`)
            let file = oldImage.imgname
            if (file != 'default.jpg')
            {
                if(fs.existsSync('./public/profile_images/' + file))
                {fs.unlinkSync('./public/profile_images/' + file)}

            }
            let result = await db.none(`UPDATE images set imgname = '${newimageaddress}' where user_id = '${pid}'`)
            res.json({"url": `/user/${req.user.id}`})
            });
    });
    
    app.get('/chat/:id', checkIsLoggedIn, async (req, res)=>{
        let sender = req.user
        let recipient_id = req.params.id
        let room_id = await checkChatRoom(sender, recipient_id, db)
        if (room_id == false){res.redirect(`/user/${req.params.id}`)}
        else{res.redirect(`/chat/room/${room_id}`)}
    })
    
    app.get('/chat/room/:id', checkIsLoggedIn, async (req,res) =>{
        let return_id = await checkLoggedUser(db, req.user.id, req.params.id)
        let messages = await renderChatRoom(db, req.params.id)
        let return_username = await returnUsername(db, return_id)
        let online_users = grabOnlineUsers(req)
        let user_chats = await grabAllUserChats(db, req.user, online_users)
        res.render("chat_room", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                chatrooms: user_chats,
                return_link:'href="/user/' + return_id + '"',
                return_username: return_username,
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

    app.get('/user/:id/connect', checkIsLoggedIn, async (req,res)=>{
        let connect = await makeConnection(db, req.params.id, req.user)
        if (connect == false){
            console.log('Connection already made')
        } else{
            console.log('Connection made succesfully')
        }
        res.redirect(`/user/${req.params.id}`)
    })

    app.get('/home', checkIsLoggedIn, async (req,res) =>{
        let online_users = grabOnlineUsers(req)
        let number_users = online_users.length
        res.render("home", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                number_users: number_users
            }
        })
    })

    app.get('/about', checkIsLoggedIn, async (req,res) =>{
        res.render("about", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`
            }
        })
    })
};
module.exports = apiRoutes;