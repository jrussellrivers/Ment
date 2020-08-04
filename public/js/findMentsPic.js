const renderSkills = require('./renderSkills.js')

const findMents = async (user, category, value, db, url) => {
    // first determine if mentee or mentor
    let notMentor = !user.mentor
    // then query database for all mentees or mentors whose information matches the query
    let ments = await db.any(`SELECT * FROM users WHERE mentor='${notMentor}' and ${category}='${value}'`)

    const getSkillSets = async (ments) => {
        let skillSets = []
        for(let j=0;j<ments.length;j++){
            let skillSet = await renderSkills(ments[j].id, db)
            skillSets.push(skillSet)
        }
        return skillSets
    }

    const grabConnections = async (user, db) => {
        // console.log(user)
        const menteeQ = await db.any(`SELECT * FROM connections WHERE mentee_id='${user.id}'`)
        const mentorQ = await db.any(`SELECT * FROM connections WHERE mentor_id='${user.id}'`)
        let result = (user.mentor == false ? menteeQ : mentorQ)
        return result
    }


    const getConnectionsLists = async (ments) => {
        let connectionLists = []
        for(let k=0;k<ments.length;k++){
            let connectionList = await grabConnections(ments[k], db)
            connectionLists.push(connectionList.length)
        }
        return connectionLists
    }


    let connectionLists = await getConnectionsLists(ments)
    let connectionString = (notMentor == true ? "mentee count": "mentor count")

    let skillSets = await getSkillSets(ments)
    let skillString = (notMentor == false ? "My target skills" : "My expertise")

    let styles = ["grad-pink", "grad-orange", "grad-blue"]
    // then generate hmtl cards for each user result. join at the end. Potentially sort them.
    let new_html = ''
    ments.map((ment, idx)=>{
        style = styles[idx%3]
        // let pic = pics[idx]
        pic_path = url + '/photos/' + ment.id
        let new_card = 
                `
                <div class="container">
                    <div class="section-content">
                    <div class="columns">
                    </div>
                    <div id="app" class="row columns is-multiline">
                        <div v-for="card in cardData" key="card.id" class="column is-12">
                            <div class="card large">
                                <div class="card-content ${style}">
                                    <div class="media">
                                        <div class="media-content">
                                            <form action="/user/${ment.id}" method="get">
                                                <button type="submit" class = "cardSubmit btn-atom">Check out ${ment.username}'s profile</button>
                                            </form>
                                            <div class="content">${ment.about}</div>
                                            <div class="content">Contact me at ${ment.email}</div>
                                            <div class="content">${skillString}: ${skillSets[idx]}</div>
                                            <div class="content">${ment.username}'s ${connectionString}: ${connectionLists[idx]}</div>
                                        </div>
                                    </div>
                                    <div class="card-image">
                                        <figure class="image">
                                            <img src=${pic_path} alt="Card Avatar">
                                        </figure>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                `
    new_html = new_html + new_card
    }).join("")
    return new_html
}

module.exports = findMents

{/* <div class="card">
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
        <p class="title is-4">John Smith</p>
        <p class="subtitle is-6">@johnsmith</p>
      </div>
    </div>

    <div class="content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Phasellus nec iaculis mauris. <a>@bulmaio</a>.
      <a href="#">#css</a> <a href="#">#responsive</a>
      <br>
      <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
    </div>
  </div>
</div> */}


// {/* <form action="/user/${ment.id}" method="get">
//     <button type="submit" class = "cardSubmit btn-atom"></button>
// </form> */}
// {/* <p></p><p class="subtitle is-6"> <a href="/user/${ment.id}">${ment.username}'s profile</a></p> */}

