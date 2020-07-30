const makeMessage = (db, message, name, roomid)=>{
    const searchRegExp = /'/g;
    const replaceWith = "''";
    const result = message.replace(searchRegExp, replaceWith)
    // const result = message.replaceAll("'", "''")
    db.none(`INSERT INTO chat_messages (sent_message, sender, chat_id) VALUES ('${result}', '${name}', '${roomid}')`)
}

module.exports = makeMessage