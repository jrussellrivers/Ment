# Welcome To Ment
![rmbanner](https://github.com/dmitchell217/ProjectM/blob/master/public/images/Ment.png)
## http://3.130.126.208:5434/

## Overview: 
Ment is a place for underprivileged people in the tech industry to network with each other. In our website, mentors and mentees can locate other users based on location, username, or email. The site focuses less on what resume qualifications a mentee may have, and more on their story.     

## The Team:
### David Mitchell: https://github.com/dmitchell217
**Primary team role:** Team Lead; Front-End markup and styling, Javascript Function writer

**Contributions:** Wrote the code to register new users to the site and add the users to our database. From there, built the funtionality of the personal User pages and added a feature to add skills to ones User page. Helped implement code to save and store images onto the server. Tied all the user information together in a search feature to display user "cards" so that users can find each other easily. Worked heavily with Express routing and storing/accessing content from the database.

### Priyanka Farrell: https://github.com/pfarrell18
**Primary team role:** Front-End markup and styling, concepting and Javascript Function writer

**Contributions:** Helped set up passport logins into the site and helped implement code to save and store images onto the server. Designed the About page, Chat Rooms, and Home page of the site. Implemented Bulma.io into said designed pages to be fully responsive.

### Carrie Grossman: https://github.com/carriegrossman
**Primary team role:** Front-End markup and styling, concepting

**Contributions:** Oversaw creative layout design of webpages. Designed the Login page, Register, and all Profile pages of the site. Worked heavily with Bulma.io to implement responsive design into all of our pages. Designed the top navbar with hamburger menu to be able to acess different portions of the site.

### Jordan Rivers: https://github.com/jrussellrivers
**Primary team role:** Front-End markup and styling, concepting and Javascript Function writer

**Contributions:** Wrote the code to send chat messages between users and also set up user connections with one another. Added the bottom chat bar functionality to be able to access the chat rooms that you are a part of as well as being able to see what users are logged into the site. Worked heavily with Express routing and storing/accessing content from the database.

## What we used:
### Languages:
- HTML5
- CSS
- JAVASCRIPT
- Node
- Express
- SQL

### Other:
- Passport
- ES6 Templates
- Bulma.io
- Chat Feature
- Search Query

## MVP (Minimum Viable Product):
- User profiles that can chat with one another
- Initial design and layout
- Basic search queries

## Stretch Goals Completed
- Fully implemented Bulma.io
- Added skills
- Storing image files
- Showed which users are online
- User connections
- Dynamic user profiles based on logged user

## Stretch Goals Future
- Adding networking event API to home page
- Be able to edit profile
- Dynamic homepage to show mentors and mentees
- Uploading video
- Live chatroom
- Implementing online classes

## Challenges & Solutions:
### ***Challenge:*** Apostrophes were not allowed in chat messages due to them being interpreted wrong in SQL

### ***Solution:*** Set up a regular expression to replace all apostrophes with 'double' apostrophes in order to store messages.
___
### ***Challenge:*** Creating a media responsive website for all formats.

### ***Solution:*** Reading Bulma.io documentation, trial and error. The website is viewable across any medium: computer, tablet or smart phone.
___
### ***Challenge:*** Correctly storing image files in order to load them on user pages

### ***Solution:*** Stored files with unique naming conventions into server. Hosted those files on our server through routing. 

## Code Snippets:
### This code is used in order to determine whether or not chat rooms currently exist between users and if they do not, it will create one.
``` javascript
const grabRoom = async (db, mentor_id, mentee_id) => {
    let room = await db.oneOrNone(`SELECT * FROM chat_rooms WHERE mentor_id='${mentor_id}' AND mentee_id='${mentee_id}'`)
    return room
}

const makeChatRoom = async (db, mentor_id, mentee_id) =>{
    let new_room_id = await db.one(`INSERT INTO chat_rooms (mentor_id, mentee_id) VALUES ('${mentor_id}','${mentee_id}') RETURNING id`)
    return new_room_id.id
}

const checkChatRoom = async (sender, recipient_id, db) =>{
    let recipient = await db.one(`SELECT * FROM users WHERE id='${recipient_id}'`)
    if(sender.mentor == true && recipient.mentor == false){
        let room = await grabRoom(db, sender.id, recipient_id)
        if(room == null){
            let new_room_id = await makeChatRoom(db, sender.id, recipient_id)
            return new_room_id
        } else {
            return room.id
        }
    } else {
        let room = await grabRoom(db, recipient_id, sender.id)
        if(room == null){
            let new_room_id = await makeChatRoom(db, recipient_id, sender.id)
            return new_room_id
        } else {
            return room.id
        }
}}
```
### This code displays all chatrooms that a logged in user is currently a part of while also showing if those users are logged in as well.
``` javascript
 const grabAllUserChats = async (db, user, online_users)=>{
    new_html = ''
    if(user.mentor == true){
        let userchats = await db.any(`SELECT * FROM chat_rooms WHERE mentor_id='${user.id}'`)
        chat_array = []
        userchats.sort((a,b)=>a.id-b.id)
        for(i=0;i<userchats.length;i++){
            let user = await db.one(`SELECT * FROM users WHERE id='${userchats[i].mentee_id}'`)
            let status = online_users.includes(user.id.toString())
            if(status == true){
                let room_html = `<a class="navbar-item" href="/chat/room/${userchats[i].id}">Chat Room With ${user.username} 🟢</a>`
                new_html = new_html + room_html
            } else {
                let room_html = `<a class="navbar-item" href="/chat/room/${userchats[i].id}">Chat Room With ${user.username} ⚪</a>`
                new_html = new_html + room_html
            }
        }
        return new_html
    } else {
        let userchats = await db.any(`SELECT * FROM chat_rooms WHERE mentee_id='${user.id}'`)
        chat_array = []
        userchats.sort((a,b)=>a.id-b.id)
        for(i=0;i<userchats.length;i++){
            let user = await db.one(`SELECT * FROM users WHERE id='${userchats[i].mentor_id}'`)
            let status = online_users.includes(user.id.toString())
            if(status == true){
                let room_html = `<a class="navbar-item" href="/chat/room/${userchats[i].id}">Chat Room With ${user.username} 🟢</a>`
                new_html = new_html + room_html
            } else {
                let room_html = `<a class="navbar-item" href="/chat/room/${userchats[i].id}">Chat Room With ${user.username} ⚪</a>`
                new_html = new_html + room_html
            }
        }
        return new_html
    }
}
```
### This snippet sets up the lobby page: it queries the database with the user's parameters, grabs the UI relevant information from various sources for each returned ment, and creates an html file to be template rendered
```javascript
const renderSkills = require('./renderSkills.js') //import required functions

const findMents = async (user, category, value, db, url) => {
    // first determine if mentee or mentor
    let notMentor = !user.mentor
    // then query database for all mentees or mentors whose information matches the query
    let ments = await db.any(`SELECT * FROM users WHERE mentor='${notMentor}' and ${category}='${value}'`)

    // grab skills for each returned ment
    const getSkillSets = async (ments) => {
        let skillSets = []
        for(let j=0;j<ments.length;j++){
            let skillSet = await renderSkills(ments[j].id, db)
            skillSets.push(skillSet)
        }
        return skillSets
    }
    // return connections for a ment
    const grabConnections = async (user, db) => {
        const menteeQ = await db.any(`SELECT * FROM connections WHERE mentee_id='${user.id}'`)
        const mentorQ = await db.any(`SELECT * FROM connections WHERE mentor_id='${user.id}'`)
        let result = (user.mentor == false ? menteeQ : mentorQ)
        return result
    }
    // grab connections for each returned ment
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
    // generate hmtl cards for each user result
    let new_html = ''
    ments.map((ment, idx)=>{
        style = styles[idx%3]
        pic_path = url + '/photos/' + ment.id; // grab photo from server url
        mentorUrl = `‘/user/${ment.id}’`;
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
                                <div class="content">${ment.username}'s ${connectionString}: ${connectionLists[idx]}</div>
                            </div>
                        <div class="card-image">
                            <figure class="image">
                                <img src=${pic_path} alt="Card Avatar">
                            </figure>
                        </div>
                        </div>
                        <div class="content">${skillString}: ${skillSets[idx]}</div>
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

```
### This code enables users to change their database-stored skills' boolean value and neatly template renders them
``` javascript
const updateSkills = async (db, user_id, skill) => {
    let value = await db.one(`SELECT ${skill} FROM skills WHERE id='${user_id}'`)
    let newValue = (Object.values(value)[0] == true ? 'f' : 't') 
    await db.none(`UPDATE skills set ${skill} = '${newValue}' where id = '${user_id}'`)
}
module.exports = updateSkills

const renderSkills = async (user_id, db) => {
    const SKILLCOUNT = 6
    const skills = ["product_management", "design", "machine_learning", "data_science", "software_engineering", "web_development"]

    const checkVal = async (skill, user_id) => {
        let result = await db.one(`SELECT ${skill} FROM skills WHERE id='${user_id}'`)
        return Object.values(result)
    }
    let cards = `
    <div class = "skills-container"> `
    for (i=0;i<SKILLCOUNT;i++) {
        let skill_name = skills[i].split("_").join(" ")
        let skillStatus =  await checkVal(skills[i], user_id)
        cards = cards + `<div class = "skill-tag ${skillStatus}">${skill_name}</div>`
    }
    cards = cards + `</div>`
    return cards
}

module.exports = renderSkills
```
