const checkConnection = async (db, profile, user)=>{
    if (user.mentor == true){
        let check = await db.oneOrNone(`SELECT * FROM connections WHERE mentor_id='${user.id}' and mentee_id='${profile.id}'`)
        if (check == null){
            return false
        } else {
            return true
        }
    } else {
        let check = await db.oneOrNone(`SELECT * FROM connections WHERE mentor_id='${profile.id}' and mentee_id='${user.id}'`)
        if (check == null){
            return false
        } else {
            return true
        }
    }
}

module.exports = checkConnection