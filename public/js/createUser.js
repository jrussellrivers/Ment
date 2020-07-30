const createUser = async (req,res,next) => {
    db = res.db
    saltRounds = res.saltRounds
    bcrypt = res.bcrypt
    let hash = await bcrypt.hash(req.body.password, saltRounds)
    let insertion = await db.none(`INSERT INTO users (username, email, password, mentor, about, zipcode) VALUES ($1, $2, $3, $4, $5, $6)`, 
    [req.body.username, req.body.email, hash, req.body.mentorBool, req.body.about, parseInt(req.body.zipcode)])
    next()
}

module.exports = createUser

