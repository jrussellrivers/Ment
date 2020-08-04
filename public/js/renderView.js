const renderSkills = require('./renderSkills.js')
const getPhoto = require('./getPhoto.js')
const createProfile = require('./createProfile.js')
const renderConnections = require('./renderConnections.js')
const grabOnlineUsers = require('./grabOnlineUsers.js')
const grabAllUserChats = require('./grabAllUserChats.js')

const renderView = async (req, res, next) => {
    db = res.db
    let guest = req.user
    let owner = await db.one(`SELECT * FROM users where id = '${req.params.id}'`)
    let userProfile = await createProfile(req.params.id, db)
    let picture = await getPhoto(req.params.id, db)
    let skillCards = await renderSkills(req.params.id, db)
    let connections = await renderConnections(db, userProfile)
    let online_users = grabOnlineUsers(req)
    let status = online_users.includes(req.params.id)
    if (status == true){
        online_pic = '🟢'
    } else {
        online_pic = '⚪'
    }
    let user_chats = await grabAllUserChats(db, req.user, online_users)


    const showMyProfile = async () => {
        res.render("myProfile", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                chatrooms: user_chats,
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: `<img src="/profile_images/${picture}">`,
                chatlink:``,
                connectbutton: ``,
                connectionslist: connections,
                actionString: 'action="/skills/' + req.params.id + '"',
                skillCards: skillCards
            }
        })
    }
    
    const showOrToEeProfile = async () => {
        res.render("mentorToMentee", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                chatrooms: user_chats,
                online: online_pic,
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: `<img src="/profile_images/${picture}">`,
                chatlink:`<form action="/chat/${userProfile.id}" method="get">
                                <button type="submit">Chat with ${userProfile.username}</button>
                            </form>`,
                connectbutton: `<form action="/user/${req.params.id}/connect" method="get">
                                    <button type="submit">Connect with ${userProfile.username}</button>
                                </form>`,
                connectionslist: connections,
                actionString: '',
                skillCards: skillCards
            }
        })
    }
    const showEeToOrProfile = async () => {
        res.render("menteeToMentor", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                chatrooms: user_chats,
                online: online_pic,
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: `<img src="/profile_images/${picture}">`,
                chatlink:`<form action="/chat/${userProfile.id}" method="get">
                                <button type="submit">Chat with ${userProfile.username}</button>
                            </form>`,
                connectbutton: `<form action="/user/${req.params.id}/connect" method="get">
                                    <button type="submit">Connect with ${userProfile.username}</button>
                                </form>`,
                connectionslist: connections,
                actionString: '',
                skillCards: skillCards
            }
        })
    }
    const showEeToEeProfile = async () => {
        res.render("mentToMent", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                chatrooms: user_chats,
                online: online_pic,
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: `<img src="/profile_images/${picture}">`,
                chatlink:``,
                connectbutton: ``,
                connectionslist: connections,
                actionString: '',
                skillCards: skillCards
            }
        })
    }
    const showOrToOrProfile = async () => {
        
        res.render("mentToMent", {
            locals: {
                myprofile: `<a href="/user/${req.user.id}" class="button is-primary"><strong>My Profile</strong></a>`,
                chatrooms: user_chats,
                online: online_pic,
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: `<img src="/profile_images/${picture}">`,
                chatlink:``,
                connectbutton: ``,
                connectionslist: connections,
                actionString: '',
                skillCards: skillCards
            }
        })
    }

    const redirect = async () => {
        res.redirect('/')
    }


    var choice;
    //  owner guest logic
    switch (true) {
        // guest is the owner
        case owner.username == guest.username:
            choice = showMyProfile;
            break;
        // both guest and owner are mentors
        case guest.mentor == true && owner.mentor == true:
            choice = showOrToOrProfile;
            break;
        // guest is mentor but owner is mentee
        case guest.mentor == true &&  owner.mentor == false:
            choice = showOrToEeProfile;
            break;
        // // both guest and owner are mentees
        case guest.mentor == false && owner.mentor == false:
            choice = showEeToEeProfile;
            break;
        // guest is mentee and owner is mentor
        case guest.mentor == false && owner.mentor == true:
            choice = showEeToOrProfile;
            break;
        default:
            choice = redirect
            break;
    }
    choice()
}
module.exports = renderView







// const showMenteeProfile = async (connections) => {
//             res.render("mentee_profile", {
//                 locals: {
//                 user: userProfile || {type:"N/A",username:"N/A"},
//                 picture: `<img src="/profile_images/${picture}">`,
//                 chatlink:`<form action="/chat/${userProfile.id}" method="get">
//                                 <button type="submit">Chat with ${userProfile.username}</button>
//                             </form>`,
//                 connectbutton: `<form action="/user/${req.params.id}/connect" method="get">
//                                     <button type="submit">Connect with ${userProfile.username}</button>
//                                 </form>`,
//                 connectionslist: connections
//                 }
//             })
//         }
        
//         const showMentorProfile = async (connections) => {
//             res.render("mentor_profile", {
//                 locals: {
//                 user: userProfile || {type:"N/A",username:"N/A"},
//                 picture: `<img src="/profile_images/${picture}">`,
//                 chatlink:`<form action="/chat/${userProfile.id}" method="get">
//                                 <button type="submit">Chat with ${userProfile.username}</button>
//                             </form>`,
//                 connectbutton: `<form action="/user/${req.params.id}/connect" method="get">
//                                     <button type="submit">Connect with ${userProfile.username}</button>
//                                 </form>`,
//                 connectionslist: connections,
//                 actionString: 'action="/skills/' + req.params.id + '"',
//                 skillCards: skillCards
//                 }
//             })
//         }