const pic = async (id, db) => {
    // findUser(id, db)
    const getDef = async () => {
        let def = await db.one("insert into images (user_id, imgname) values ($1, $2) RETURNING *", [id, 'default.jpg'])
        return def.imgname
    }
    let photo = await db.oneOrNone(`SELECT imgname FROM images WHERE user_id='${id}'`)
    // return (photo == null ? await getDef() : photo)
    return (photo == null ? getDef() : photo.imgname)
}

module.exports = pic