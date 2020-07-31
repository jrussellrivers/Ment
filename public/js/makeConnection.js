const checkConnection = require('./checkConnection.js')

const makeConnection = async (db, profile_id, user)=>{
    let profile_user = await db.one(`SELECT * FROM users WHERE id='${profile_id}'`)
    let check = await checkConnection(db, profile_user, user)
    if (check == true){
        return false
    }
    if (user.mentor == true){
        let new_connecton = await db.none(`INSERT INTO connections (mentor_id, mentee_id) VALUES ('${user.id}', '${profile_user.id}')`)
        return true
    } else {
        let new_connecton = await db.none(`INSERT INTO connections (mentor_id, mentee_id) VALUES ('${profile_user.id}', '${user.id}')`)
        return true
    }
}

module.exports = makeConnection