const grabRoom = async (db, mentor_id, mentee_id) => {
    let room = await db.oneOrNone(`SELECT * FROM chat_rooms WHERE mentor_id='${mentor_id}' AND mentee_id='${mentee_id}'`)
    return room
}

const makeChatRoom = async (db, mentor_id, mentee_id) =>{
    let new_room_id = await db.one(`INSERT INTO chat_rooms (mentor_id, mentee_id) VALUES ('${mentor_id}','${mentee_id}') RETURNING id`)
    return new_room_id.id
}

const checkChatRoom = async (sender, recipient_id, db) =>{
    let recipient = await db.one(`SELECT * FROM users WHERE id='${recipient_id}'`)
    console.log(sender)
    console.log(recipient)
    if(sender.mentor == true && recipient.mentor == false){
        let room = await grabRoom(db, sender.id, recipient_id)
        if(room == null){
            let new_room_id = await makeChatRoom(db, sender.id, recipient_id)
            return new_room_id
        } else {
            return room.id
        }
    } else if ((sender.mentor == false && recipient.mentor == false)||(sender.mentor == true && recipient.mentor == true)) {
        console.log('Only Mentors and Mentees can chat with one another')
        return false
    } else {
        let room = await grabRoom(db, recipient_id, sender.id)
        if(room == null){
            let new_room_id = await makeChatRoom(db, recipient_id, sender.id)
            return new_room_id
        } else {
            return room.id
        }
}}

module.exports = checkChatRoom