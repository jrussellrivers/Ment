# Ment
![rmbanner](https://github.com/dmitchell217/ProjectM/blob/master/public/images/Ment.png)
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

**Contributions:** Oversaw creative layout design of webpages. Designed the Login page, Register, and all Profile pages of the site.Worked heavily with Bulma.io to implement responsive design into all of our pages. Designed the top navbar with hamburger menu to be able to acess different portions of the site.

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
### This code displays all chatrooms that a loggin in user is currently a part of while also showing if those users are logged in as well.
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
### This is where findmentspic goes.
```javascript
// put it here
```
### This code constructs our Weather data from the API
``` javascript

```
