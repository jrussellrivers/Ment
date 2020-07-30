const passport = require('passport')
const formidable = require("formidable");
const Strategy = require('passport-local').Strategy
const checkIsLoggedIn = require('./public/js/checkIsLoggedIn.js')
const checkIfExist = require('./public/js/checkIfExist.js')
const createUser = require('./public/js/createUser.js')
const createProfile = require('./public/js/createProfile.js')
const findMents = require('./public/js/findMents.js')
const checkChatRoom = require('./public/js/checkChatRoom.js')
const renderChatRoom = require('./public/js/renderChatRoom.js')
const makeMessage = require('./public/js/makeMessage.js')

const bcrypt = require('bcrypt')
const saltRounds = 10

const apiRoutes = (app, db)=>{
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
        db.one(`SELECT * FROM users WHERE username='${username}'`)
        .then(u=>{
            console.log(u) //
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

    app.get(`/user/:id`, checkIsLoggedIn, async (req,res)=> {
        // createProfile(req.params.id,db)
        let userProfile = await createProfile(req.params.id, db)
        // this can be declared elsewhere...
        const showMenteeProfile = () => {
            res.render("mentee_profile", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>'
                }
            })
        }
        const showMentorProfile = () => {
            res.render("mentor_profile", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>'
                }
            })
        }
        if (userProfile.mentor == false) {
            showMenteeProfile();
        } else if (userProfile.mentor == true) {
        showMentorProfile();
        } else {
        res.redirect('/');
        }
    })
    var new_cards = undefined
    app.get(`/lobby`, checkIsLoggedIn, (req,res)=> {
        console.log(new_cards)
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
        let result = await findMents(req.user, category, searchQ, db);
        new_cards = result
        res.redirect('/lobby')
    
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

    app.post("/image-uploaded", async (req, res) => {
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
            form.profile_image = file.path.replace(__dirname + "/public", "");
            })

            .on ("end", async () => {
            console.log("your photo is uploaded!");
            
            //Now i can save the form to the database
            let newimageaddress= '<img src="' + form.profile_image + '" alt="profile pic">'
            let results = await db.none("insert into images (user_id, imgname) values ($1, $2)", [req.user.id, newimageaddress])
            console.log(results)
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
    
    app.get('/chat/room/:id', async (req,res) =>{
        let return_message = await checkLoggedUser(db, req.user.id, req.params.id)
        let messages = await renderChatRoom(db, req.params.id)
        res.render("chat_room", {
            locals: {
            return_link:'href="' + return_message + '"',
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
};
module.exports = apiRoutes;