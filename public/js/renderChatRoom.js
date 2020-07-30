const renderChatRoom = async (db, room_id) =>{
    let messages = await db.any(`SELECT * FROM chat_messages WHERE chat_id='${room_id}'`)
    new_html = ''
    messages.map(message=>{
        let date = message.sent_at
        let new_date = date.toGMTString()
        let new_message = `<div class='message'>
        <span class='message-name'>${message.sender}  </span>
        <span class='message-time'>[${new_date}]  </span>:
        <span class='message-message'>  ${message.sent_message}</span>
        <div>`
        new_html = new_html + new_message
    }).sort((a,b)=>a.sent_at-b.sent_at).join("")
    return new_html
}

module.exports = renderChatRoom