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

**Contributions:** Oversaw creative layout design of webpages. Worked heavily with Bulma.io to implement responsive design into all of our pages. Designed the top navbar with hamburger menu to be able to acess different portions of the site.

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
### Our main Javascript file displays the Slider Feature of the menu and Light/Dark mode code.
``` javascript

//Code for Slider Menu
function openSlideMenu(){
    document.getElementById('menu').style.width='250px';
}
function closeSlideMenu(){
    document.getElementById('menu').style.width='0';
}

let menuOpen = document.getElementById('menu-open')
menuOpen.addEventListener('click', ()=>{
    openSlideMenu()
})

let menuClose = document.getElementById('menu-close')
menuClose.addEventListener('click', ()=>{
    closeSlideMenu()
})

// -----------------------------------------------------
// Allows user to toggle button to change background color
const chk = document.getElementById('chk');
chk.addEventListener('change', (cards) => {
  document.body.classList.toggle('dark');
  closeSlideMenu()
});
```
### This code allows the user to submit a search based on a query.
``` javascript
 //Allows user to search based on query 
import startSearch from './startSearch.js'
import nextPage from './nextPage.js'

let page = 1

let submitSearch = document.getElementById('Search')
submitSearch.addEventListener('click', ()=>{
    let inpActivity = document.getElementById('inpActivity').value
    let inpRadius = document.getElementById('inpRadius').value
    let inpDate = document.getElementById('inpDate').value
    let continuousDate = inpDate + '..'
    page = 1

    return startSearch(inpActivity, page, continuousDate, inpRadius)
})

let nextButton = document.getElementById('next')
nextButton.addEventListener('click', ()=>{
    page += 1

    let inpActivity = document.getElementById('inpActivity').value
    let inpRadius = document.getElementById('inpRadius').value
    let inpDate = document.getElementById('inpDate').value
    let continuousDate = inpDate + '..'

    nextPage(inpActivity, page, continuousDate, inpRadius)
})
```
### This is the actual data fetch.
```javascript
//Fetching the data from the API
import {activeKey, proxy} from "../config.js";
import fillPage from './fillPage.js'

function storePage(activity, page, date, radius){
    fetch(`${proxy}http://api.amp.active.com/v2/search?query=${activity}&current_page=${page}&category=event&near=Atlanta,GA,US&start_date=${date}&radius=${radius}&api_key=${activeKey}`, {
    })
    .then(resp=>resp.json())
    .then(json=>{
        fillPage(json.results)
    })
}

export default storePage
```
### This code constructs our Weather data from the API
``` javascript
//greet and time
const time = document.getElementById('time'),
greeting = document.getElementById('greeting'),
name = document.getElementById('name'),
focus = document.getElementById('focus');

// Options
const showAmPm = true;

// Show Time
function showTime() {
    let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

    // Set AM or PM
    const amPm = hour >= 12 ? 'PM' : 'AM';

    // 12hr Format
    hour = hour % 12 || 12;

    // Output Time
    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(
        sec
    )} ${showAmPm ? amPm : ''}`;

    setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Run
showTime();


fetch('http://api.openweathermap.org/data/2.5/weather?q=Atlanta&appid=6a899e0702d3b935e5d01d1b77ea6d59')
.then(resp=>resp.json())
.then(json=>{
    let city = json.name
    let tempKelv = json.main.temp
    let tempF = (tempKelv - 273.15) * 9/5 + 32
    let roundedTemp = Math.round(tempF)
    let temp = document.getElementById('temp')
    temp.innerText = roundedTemp + '°'
    let newCity = document.getElementById('city')
    newCity.append(city)
    let humidity = json.main.humidity
    let humidityDiv = document.getElementById('humidity')
    humidityDiv.innerText = humidity + '% Humidity'
})
```
## Demo of search feature
[![Fit Pals demo](http://img.youtube.com/vi/W_FmXOzzQYU/0.jpg)](https://youtu.be/W_FmXOzzQYU)
