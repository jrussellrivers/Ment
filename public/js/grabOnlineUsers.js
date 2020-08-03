const grabOnlineUsers = req =>{
    let userArray = []
    let userIdArray = []
    let sessions = Object.values(req.sessionStore.sessions)
    sessions.forEach(user =>{
        userArray.push(JSON.parse(user))
    })
    userArray.forEach(user=>{
        userIdArray.push(user.passport.user.toString())
    })
    return userIdArray
}

module.exports = grabOnlineUsers