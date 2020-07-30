const secretInfo = ()=>{
    const secret = {secret:'tghvbREGsdgwhwghwrggERgerBHerb', resave: false, saveUninitialized: false}
    const connect = {
        host:'localhost',
        port:5432,
        user:'priyankafarrell', //Put your name here for now
        database:'project_m'
    }
    return {secret, connect}
}
module.exports = secretInfo