
// need to get db in here
const checkIfExist = async (req, res, next)=> {
    db = res.db
    let result = await db.oneOrNone(`SELECT * FROM users WHERE username='${req.body.username}'`)
    result != null ? res.send(`User Already Exists`) : next()
}

// const checkIfExist = (req,res,next)=>{
//     // modularize pg-promise commands
//     // BIG UPDATE COMING
//     db.one(`SELECT username FROM users WHERE username='${req.body.username}'`)
//     .then(u=>{
//         if(u) return res.send(`User Already Exists`)
//     })
//     .catch(()=>next())
// }

module.exports = checkIfExist