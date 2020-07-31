const returnUsername = async (db, id)=>{
    let user = await db.one(`SELECT * FROM users WHERE id='${id}'`)
    return user.username
}

module.exports = returnUsername