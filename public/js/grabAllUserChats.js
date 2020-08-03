let grabAllUserChats = async (db, user, online_users)=>{
    new_html = ''
    if(user.mentor == true){
        let userchats = await db.any(`SELECT * FROM chat_rooms WHERE mentor_id='${user.id}'`)
        chat_array = []
        userchats.sort((a,b)=>a.id-b.id)
        for(i=0;i<userchats.length;i++){
            let user = await db.one(`SELECT * FROM users WHERE id='${userchats[i].mentee_id}'`)
            let status = online_users.includes(user.id.toString())
            if(status == true){
                let room_html = `
                <a class="navbar-item" href="/chat/room/${userchats[i].id}">Chat Room With ${user.username} 🟢</a>
                `
                new_html = new_html + room_html
            } else {
                let room_html = `
                <a class="navbar-item" href="/chat/room/${userchats[i].id}">Chat Room With ${user.username} ⚪</a>
                `
                new_html = new_html + room_html
            }
        }
        return new_html
    } else {
        let userchats = await db.any(`SELECT * FROM chat_rooms WHERE mentee_id='${user.id}'`)
        chat_array = []
        userchats.sort((a,b)=>a.id-b.id)
        for(i=0;i<userchats.length;i++){
            let user = await db.one(`SELECT * FROM users WHERE id='${userchats[i].mentor_id}'`)
            let status = online_users.includes(user.id.toString())
            if(status == true){
                let room_html = `
                <a class="navbar-item" href="/chat/room/${userchats[i].id}">Chat Room With ${user.username} 🟢</a>
                `
                new_html = new_html + room_html
            } else {
                let room_html = `
                <a class="navbar-item" href="/chat/room/${userchats[i].id}">Chat Room With ${user.username} ⚪</a>
                `
                new_html = new_html + room_html
            }
        }
        return new_html
    }
    
}

module.exports = grabAllUserChats