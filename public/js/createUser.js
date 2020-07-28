const createUser = (req,res,next)=>{
    bcrypt.hash(req.body.password, saltRounds)
    .then(hash=>{

        // this needs to be updated 
        db.none(`INSERT INTO users (username, email, password, type, about) VALUES ($1, $2, $3, $4, $5)`, 
        [req.body.username, req.body.email, hash, req.body.type, req.body.about])
        .then(()=>next())
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}

module.exports = createUser