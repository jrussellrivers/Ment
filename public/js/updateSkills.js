const updateSkills = async (db, user_id, skill) => {
    let value = await db.one(`SELECT ${skill} FROM skills WHERE id='${user_id}'`)
    let newValue = (Object.values(value)[0] == true ? 'f' : 't') 
    await db.none(`UPDATE skills set ${skill} = '${newValue}' where id = '${user_id}'`)
}
module.exports = updateSkills