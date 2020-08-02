const createUser = async (req,res,next) => {
    db = res.db
    saltRounds = res.saltRounds
    bcrypt = res.bcrypt
    let hash = await bcrypt.hash(req.body.password, saltRounds)
    const searchRegExp = /'/g;
    const replaceWith = "''";
    const result = req.body.about.replace(searchRegExp, replaceWith)
    let insertion = await db.none(`INSERT INTO users (username, email, password, mentor, about, zipcode) VALUES ($1, $2, $3, $4, $5, $6)`, 
    [req.body.username, req.body.email, hash, req.body.mentorBool, result, parseInt(req.body.zipcode)])
    await db.none(`INSERT INTO skills (pm, creative, ml, datascience, softwareengineering, webdev) VALUES ($1, $2, $3, $4, $5, $6)`, 
    ['f', 'f', 'f', 'f', 'f', 'f'])
    next()
}

module.exports = createUser
