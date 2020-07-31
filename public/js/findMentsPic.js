const findMents = async (user, category, value, db) => {
    // first determine if mentee or mentor
    let notMentor = !user.mentor
    // then query database for all mentees or mentors whose information matches the query
    // let ments = await db.all(`SELECT * FROM users WHERE mentor='${user.mentor}' and name ='${name}' and email ='${email}' and zipcode ='${zipcode}'`)
    // let ments = await db.any(`SELECT * FROM users WHERE mentor='${user.mentor}' and ${category}='${value}'`)
    let ments = await db.any(`SELECT * FROM users WHERE mentor='${notMentor}' and ${category}='${value}'`)
    const getPhoto = async (ment) => {
        let pic = await db.one(`SELECT * FROM images WHERE user_id='${ment.id}'`)
        console.log(pic)
        return pic
    }
    const createCards = async (ments) => {
    // then generate hmtl cards for each user result. join at the end. Potentially sort them.
        let new_html = ''
        ments.map(async (ment, idx)=>{
            let pic = await getPhoto(ment)
            console.log(pic, "18")
            // if(pic[pic.length -1]!= '>'){pic[pic.length -1]!= '>'} // add a closing arrow
            let new_card = 
                `
                <div class="card">
                    <div class="card-content">
                        <div class="media">
                        <div class="media-left">
                            <figure class="image is-24x24">
                            ${pic.imgname}
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
                console.log(new_card)
        }).sort((a,b)=>a.username-b.username).join("")
        return new_html
    }
    // then back in the route itself, render the lobby template with the html variable from the above ste
    let output = await createCards(ments)
    return output
}

module.exports = findMents


{/* <div class="card-image">
<figure class="image is-4by3">
<img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
</figure>
</div> */}