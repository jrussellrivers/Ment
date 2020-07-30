const findMents = async (user, category, value, db) => {
    // first determine if mentee or mentor
    let notMentor = !user.mentor
    // then query database for all mentees or mentors whose information matches the query
    // let ments = await db.all(`SELECT * FROM users WHERE mentor='${user.mentor}' and name ='${name}' and email ='${email}' and zipcode ='${zipcode}'`)
    // let ments = await db.any(`SELECT * FROM users WHERE mentor='${user.mentor}' and ${category}='${value}'`)
    let ments = await db.any(`SELECT * FROM users WHERE mentor='${notMentor}' and ${category}='${value}'`)

    // then generate hmtl cards for each user result. join at the end. Potentially sort them.
    let new_html = ''
    ments.map(ment=>{
        let new_card = 
            `
            <div class="card">
                <div class="card-image">
                    <figure class="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                        <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">${ment.username}</p>
                        <p class="subtitle is-6">${ment.email}</p>
                        <p class="subtitle is-6">${ment.zipcode}</p>
                    </div>
                    </div>

                    <div class="content">
                    ${ment.about}
                    <a href="/user/${ment.id}">Ment Profile</a>
                    <br>
                    </div>
                </div>
            </div>
            `
            new_html = new_html + new_card
    }).sort((a,b)=>a.username-b.username).join("")
    return new_html
    // then back in the route itself, render the lobby template with the html variable from the above ste
}

module.exports = findMents

// db.one(`SELECT * FROM users WHERE id='${id}'`
// let insertion = await db.none(`INSERT INTO users (username, email, password, mentor, about, zipcode) VALUES ($1, $2, $3, $4, $5, $6)`, 
//     [req.body.username, req.body.email, hash, req.body.mentorBool, req.body.about, parseInt(req.body.zipcode)])
// 

// const renderChatRoom = async (db, room_id) =>{
//     let messages = await db.any(`SELECT * FROM chat_messages WHERE chat_id='${room_id}' `)
//     new_html = ''
//     messages.map(message=>{
//         let new_message = `<div class='message'>
//         ${message.sender}(${message.sent_at}):${message.sent_message}
//         <div>`
//         new_html = new_html + new_message
//     }).sort((a,b)=>a.sent_at-b.sent_at).join("")
//     return new_html
// }


// rout

// app.get('/chat/room/:id', async (req,res) =>{
//     let messages = await renderChatRoom(db, req.params.id)
//     res.render("chat_room", {
//         locals: {
//         room_id:req.params.id,
//         messages: messages
//         }
//     })
// })

