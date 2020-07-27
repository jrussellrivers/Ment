const checkIfExist = (req,res,next)=>{
    db.one(`SELECT username FROM users WHERE username='${req.body.username}'`)
    .then(u=>{
        if(u) return res.send(`User Already Exists`)
    })
    .catch(()=>next())
}

module.exports = checkIfExist