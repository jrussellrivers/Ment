const renderConnections = (db, profile) =>{
    var new_connection = ''

    const connectionNameMentor = async (db, con)=>{
        let con_user = await db.one(`SELECT * FROM users WHERE id='${con.mentor_id}'`)
        let new_con = `<div><a class="connection" href="/user/${con_user.id}">${con_user.username}</a></div>`
        new_connection = new_connection + new_con
    }

    const connectionNameMentee = async (db, con)=>{
        let con_user = await db.one(`SELECT * FROM users WHERE id='${con.mentee_id}'`)
        let new_con = `<div><a class="connection" href="/user/${con_user.id}">${con_user.username}</a></div>`
        new_connection = new_connection + new_con
    }

    const render = async (db, profile) =>{
        if (profile.mentor == true){
            let connections = await db.any(`SELECT * FROM connections WHERE mentor_id='${profile.id}'`)
            let getConName = async ()=>{
                for (i=0;i<connections.length;i++){
                    await connectionNameMentee(db, connections[i])
                }
            }
            if (connections == undefined){
                return new_connection
            } else {
                await getConName(db, connections)
                return new_connection
            }
        } else {
            let connections = await db.any(`SELECT * FROM connections WHERE mentee_id='${profile.id}'`)
            let getConName = async ()=>{
                for (i=0;i<connections.length;i++){
                    await connectionNameMentor(db, connections[i])
                }
            }

            if (connections == undefined){
                return new_connection
            } else {
                await getConName(db, connections)
                return new_connection
            }
        }
    }

    return render(db,profile)
}

module.exports = renderConnections