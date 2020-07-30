const checkLoggedUser = async (db, user_id, room_id) =>{
    let current_user = await db.one(`SELECT * FROM users WHERE id='${user_id}'`)
    let room = await db.one(`SELECT * FROM chat_rooms WHERE id='${room_id}'`)
    if (current_user.mentor == true){
        return `/user/${room.mentee_id}`
    } else {
        return `/user/${room.mentor_id}`
    }
}

module.exports = checkLoggedUser