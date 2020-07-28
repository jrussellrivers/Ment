const db = require('../../app')
const User = require('./User')(db);


const checkIfExist = async (req, res, next)=> {
    let result = await User.confirmUser(req.body.username)
    result ? res.send(`User Already Exists`) : next()
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

