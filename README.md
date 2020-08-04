# Ment
<img src="https://imgur.com/a/OYz8SdQ">
## Overview: 
Fit Pals is a dedicated search for physical events in the Atlanta area. By users querying their search, they may return up-to-date events in which to participate in either solo, with loved ones or to meet new friends. Each search returns events, in your area, on the date and for events thereafter.

## The Team:
### Jordan Rivers: https://github.com/jrussellrivers
**Primary team role:** Team Lead; Front-End markup and styling, Javascript Function writer

**Contributions:** Designed and implemented search query using Active.com API Event Search. Assisted with Style and Layout Design. Oversaw organization of all javascript files and implementations. Created Contact page. 

### Mike Cadima: https://github.com/mikecadima
**Primary team role:** Front-End markup and styling, concepting and Javascript Function writer

**Contributions:** Oversaw creation of Landing Page of project application. Implemented "slideable" menu and created div block with data from Weather API and a time counter function. 

### PJ Almeida: https://github.com/palmeida7
**Primary team role:** Front-End markup and styling, concepting and Javascript Function writer

**Contributions:** Oversaw creative layout design of webpages. Implemented Light/Dark mode feature and calendar frame. Designed Events Page and ReadMe document.

## What we used:
### Languages:
- HTML5
- CSS
- JAVASCRIPT

### APIs
- Active.com Search
- Open Weather Map

### Other:
- JSON
- Favicon
- Google Calendar
- Light/Dark Mode
- Slider Menu
- Query Search

## MVP (Minimum Viable Product):
- Search query for physical events in the Atlanta, Georgia area
- Initial design and layout
- Slider menu

## Stretch Goals Completed
- Using Promise to obtain data from API
- Sliding Menu
- Light/Dark mode feature
- Modern look of webpages
- Implementing data div with Weather API and time counter function

## Stretch Goals Future
- Allowing users to create personal profiles and connect with others attending the same events
- Expand city and activities search to include more metros and events to choose from 
- Functioning Calendar API

## Challenges & Solutions:
### ***Challenge:*** Obtaining a proxy solution that would allow us to access the data from the API upon calling it, despite a CORS error.
### ***Solution:*** Inserted proxy code before url to allow obtaining the information.
___
### ***Challenge:*** Creating a media responsive website for all formats.

### ***Solution:*** Reading documentation, trial and error. The website is viewable across any medium: computer, tablet or smart phone.
___
### ***Challenge:*** Correctly implementing other API's and functions to create an informative and active page.

### ***Solution:*** Experimenting with code structure to produce the correct output.

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
