const renderSkills = require('./renderSkills.js')

const findMents = async (user, category, value, db, url) => {
    // first determine if mentee or mentor
    let notMentor = !user.mentor
    // then query database for all mentees or mentors whose information matches the query
    let ments = await db.any(`SELECT * FROM users WHERE mentor='${notMentor}' and ${category}='${value}'`)
    
    
    const getSkillSets = async (ments) => {
        let skillSets = []
        for(i=0;i<ments.length;i++){
            let skillSet = await renderSkills(ments[i].id, db)
            skillSets.push(skillSet)
        }
        return skillSets
    }

    let skillSets = await getSkillSets(ments)

    const getPhoto = async (id) => {
        let result = await db.oneOrNone(`SELECT * FROM images WHERE user_id='${id}'`)
        return (result == null ? '../profile_images/default.jpg' : result)
    }
    // let pics = []
    // const getPhotos = async (ments) => {
    //     for(i=0;i<ments.length;i++){
    //         let pic = await getPhoto(ments[i].id)
    //         pics.push(pic.imgname)
    //     }
    // }
    // getPhotos(ments)

    // then generate hmtl cards for each user result. join at the end. Potentially sort them.
    let new_html = ''
    ments.map((ment, idx)=>{
        // let pic = pics[idx]
        pic_path = url + '/photos/' + ment.id
        let new_card = 
                `
                <form action="/user/${ment.id}" method="get">
                <button type="submit" class = "cardSubmit">
                <div class="container">
        <div class="section">
            <div class="columns">
            <div class="column has-text-centered">
                <h1 class="title" style="color: ghostwhite;">${ment.username}</h1><br>
            </div>
            </div>
            <div id="app" class="row columns is-multiline">
            <div v-for="card in cardData" key="card.id" class="column is-4">
                <div class="card large">
                <div class="card-image is-16by9">
                    <figure class="image">
                    <img src=${pic_path} alt="Card Avatar">
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                    <div class="media-content">
                        <p class="title is-4 no-padding">${ment.username}</p>
                        <p>
                        <p class="subtitle is-6">
                        <li><a href="/user/${ment.id}">${ment.username}'s profile</a>
                        </p>
                    </div>
                    </div>
                    <div class="content">
                    ${ment.about}
                    </div>
                    <div class="content">
                    Contact me at ${ment.email}
                    </div>
                    <div class="content">
                    My Expertise: ${skillSets[idx]}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        </button>
        </form>
        <footer class="footer">
        <div class="container">
            <div class="content has-text-centered">
            <div class="soc">
                <a href="#"><i class="fa fa-github-alt fa-lg" aria-hidden="true"></i></a>
                <a href="#"><i class="fa fa-youtube fa-lg" aria-hidden="true"></i></a>
                <a href="#"><i class="fa fa-facebook fa-lg" aria-hidden="true"></i></a>
                <a href="#"><i class="fa fa-twitter fa-lg" aria-hidden="true"></i></a>
            </div>
            </div>
        </div>
        </footer>
                `
    new_html = new_html + new_card
    }).join("")
    return new_html
}

module.exports = findMents
