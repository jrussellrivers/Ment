const renderChatRoom = async (db, room_id) =>{
    let messages = await db.any(`SELECT * FROM chat_messages WHERE chat_id='${room_id}'`)
    let room = await db.one(`SELECT * FROM chat_rooms WHERE id='${room_id}'`)
    let mentee = await db.one(`SELECT * FROM users WHERE id='${room.mentee_id}'`)
 
    new_html = ''

    
    messages.map(message=>{
        let date = message.sent_at
        let new_date = date.toGMTString()
        if (message.sender == mentee.username){
            let new_message = `<tr><td class ='has-text-primary-dark'><strong>${message.sender}</strong><br>${new_date}</td>
            <td class='message-message'>  ${message.sent_message}</td></tr>
            `
            new_html = new_html + new_message
        }else{
            let new_message = `<tr><td class ='has-text-primary-dark'><strong>${message.sender}</strong><br>${new_date}</td>
            <td class='message-message'>  ${message.sent_message}</td></tr>
            `
            new_html = new_html + new_message
        }
    }).sort((a,b)=>a.sent_at-b.sent_at).join("")
    return new_html
}

module.exports = renderChatRoom