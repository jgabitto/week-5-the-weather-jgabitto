let rainDrops = [];
let clouds = [];
let numClouds = 0;
let shack;
let canvas;
let weather;
let feelsLike;
let weatherDescription;
let weatherMain;
let hot = false;
let time = 0;
let y = -200;
let started = false;

const container = document.getElementById('info');

function preload() {
    // Load sun picture
    sun = loadImage("sun.png");

}

function setup() {
    // Create canvas
    canvas = createCanvas(displayWidth, displayHeight + 234.72);
    // Place canvas under div id=info
    canvas.parent(container);
    // Hide canvas
    canvas.addClass('hidden');

    // Create 1000 rain drops
    for (let i = 0; i < 1000; i++) {
        rainDrops[i] = new Rain();
    }

    // Create 15 clouds
    for (let i = 0; i < 15; i++) {
        clouds[i] = new Cloud();
    }
    
}
  
function draw() {
    // Clear the canvas
    clear();
    // Set background color to 240 grayscale integer value
    background(240);

    // Determine the type of weather animation
    switch (weather) {
        case 'rain':
            // Delay animation
            if (time !== 100) {
                time += 1;
            } else {
                // Make canvas visible
                canvas.removeClass('hidden');
                // Run rain animation
                rainShower();
            } 
            break;
        case 'sun':
            // Delay animation
            if (time !== 100) {
                time += 1;
            } else {
                // Make canvas visible
                canvas.removeClass('hidden');
                // Run sunshine animation
                sunshine();
                // Run clouds animation
                drawClouds();
            } 
            break;
        default:
            break;
    }
    
}
// Sunshine animation
function sunshine() {
    // Create sun image
    image(sun,0,y,200,200);
    // Move sun to (0, -50) .5 at a time
    if (y !== -50) {
        y += .5;
    }

    // If feelsLike is hot
    if (hot) {
        // Set ellipseMode to radius
        ellipseMode(RADIUS);
        // 
        fill(255,245,125,10); 

        // disable stroke outline
        noStroke();
        // Paint background this color
        fill(200, 130, 10, 20);
        // Draw sun rays
        ellipse(100, y+100, (frameCount % 500)*2, (frameCount % 500)*2);
        ellipse(100, y+100, (frameCount % 500)*4, (frameCount % 500)*4);
        ellipse(100, y+100, (frameCount % 500)*8, (frameCount % 500)*8);
        ellipse(100, y+100, (frameCount % 500)*16, (frameCount % 500)*16);
        ellipse(100, y+100, (frameCount % 500)*24, (frameCount % 500)*24);
    }
}
// Rain animation
function rainShower() {
    for (let i = 0; i < rainDrops.length; i++) {
        rainDrops[i].show();
        rainDrops[i].fall();
        // rainDrops[i].edges();
    }
}
// Rain class
class Rain {
    constructor() {
        // x, y, z coordinates of drop
        this.x = random(width);
        this.y = random(-500, -10);
        this.z = random(0, 10);
        this.size = map(this.z, 0, 20, 5, 20);
        this.yspeed = map(this.z, 0, 20, 3, 10);
        this.grav = map(this.z, 0, 20, 0.025, 0.2);
    }
    // Rain fall function
    fall() {
        this.y = this.y + this.yspeed;
        this.speed = this.speed + this.grav

        if (this.y > height) {
            this.y = random(-50, -10);
            this.speed = map(this.z, 0, 20, 4, 10);
        }
    }
    // Draw Rain
    show() {
        stroke(175, 195, 204);
        line(this.x, this.y, this.x, this.y + this.size);
    }
}
// Draw clouds
function drawClouds() {
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].move();
        clouds[i].display();
    }
}
// Cloud class
class Cloud {
    constructor() {
      this.x = random(-1000, -100);
      this.y = random(2, 150);
    }
  
    display() {
      push();
      stroke(255);
      strokeWeight(1);
      fill(255);
      ellipse(this.x, this.y, 24, 24);
      ellipse(this.x + 10, this.y + 10, 24, 24);
      ellipse(this.x + 30, this.y + 10, 24, 24);
      ellipse(this.x + 30, this.y - 10, 24, 24);
      ellipse(this.x + 20, this.y - 10, 24, 24);
      ellipse(this.x + 40, this.y, 24, 24);
      pop();
    }
  
    move() {
      this.x = this.x + .3;
      this.y = this.y + random(-0.5, 0.5);
  
      if (this.x >= width) {
        this.x = 0;
      }
    }
  }

const API_KEY = '9a8bb38aaa5991effeabca196f6c4ecb';

const cityInput = document.getElementById('city');
const submitBtn = document.getElementById('submit');
const paragraph = document.querySelector('p');
const table = document.querySelector('table');
const day = document.getElementById('day');
const min = document.getElementById('min');
const max = document.getElementById('max');
const iconImg = document.getElementById('icon');

let url = `https://api.openweathermap.org/data/2.5`;
/* 
https://api.openweathermap.org/data/2.5/onecall?lat=29.749907&lon=-95.358421&exclude=current,minutely,hourly&appid=9a8bb38aaa5991effeabca196f6c4ecb&units=imperial
*/

// Get location
const getLocation = async () => {
    try {
        // If there's an input value
        if (cityInput.value) {
            // Make fetch call to weather api
            const response = await fetch(`${url}/weather?q=${cityInput.value}&appid=${API_KEY}`);
            // If city searched is bad
            if (response.status === 404) {
                // Put warning
                paragraph.innerHTML = 'City does not exist! Please enter the city again.';
            }
    
            return response.json();
        } else {
            // If city search is empty
            paragraph.innerHTML = "Please enter the name of a city!";
        }
    } catch (e) {
        console.log(e.message);
    }
}

// Get weather data
const getWeather = async ({coord: { lat, lon }}) => {
    try {
        // Fetch call to weather api
        const response = await fetch(`${url}/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${API_KEY}&units=imperial`);

        return response.json();
    } catch (e) {
        console.log(e.message);
    }
} 
// Convert time from unix to formatted time
function timeConverter(timestamp) {
    // Change timestamp to formatted time
    var formattedTime = moment.unix(timestamp);

    return formattedTime.format('MMMM Do YYYY, h:mm:ss a');
}
// Submit button eventListener
submitBtn.addEventListener('click', submitInput);
// Enter key eventListener
cityInput.addEventListener('keydown', (e) => {
    // If enter is pressed
    if (e.key === 'Enter') {
        submitInput();
    }
})
// Submit input function
async function submitInput() {
    try {
        let array = [];
        // Get city location
        const response = await getLocation();
        // If response is undefined
        if (!response) {
            return;
        }
        // Get weather information using city location
        const { daily } = await getWeather(response);
        // Add day, temp_min, temp_max, humidity, feels_like, icon, description to an array
         for (let i = 0; i < 7; i++) {
             array.push({ 'Day': timeConverter(daily[i].dt), 'Temp/Humidity': `${daily[i].temp.min}\u00B0/ ${daily[i].temp.max}\u00B0/ ${daily[i].humidity}%`, 'Feels Like': `${daily[i].feels_like.day}\u00B0`,'Weather': `${daily[i].weather[0].icon} ${daily[i].weather[0].description}`});
         }
         // If tableBody is not empty
         if (table.tBodies.length !== 0) {
             // Remove tableBody
             table.removeChild(table.getElementsByTagName("tbody")[0]);
         }
         // Hide paragraph
         paragraph.classList.add('hidden');
         // Show table
         table.classList.remove('hidden');
         // Create tableBody
         let tbody = table.createTBody();
         // For each object in array
         for (let object of array) {
             // Insert a row inside tableBody
             let row = tbody.insertRow();
             // For each key in object
             for (key in object) {
                 // Insert cell inside row
                 let cell = row.insertCell();
                 // If key is weather, add icon and description
                 if (key == 'Weather') {
                     // Create icon from each object
                     let icon = object[key].substr(0,object[key].indexOf(' '));
                     // Create description from each object
                     let weatherDesc = object[key].substr(object[key].indexOf(' ')+1);
                     // Create image element
                     let img = document.createElement('IMG');
                     // Add img src for each object
                     img.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
                     // Create text node with description
                     let text = document.createTextNode(weatherDesc);
                    // Add img and description to cell
                     cell.appendChild(img);
                     cell.appendChild(text);
                 } else { // If key isn't 'Weather'
                     // Create textNode with object value
                     let text = document.createTextNode(object[key]);
                     // Add description to cell
                     cell.appendChild(text);
                 }
             }
         }
         // feelsLike, weatherDescription, weatherMain is determined from the first day in daily object
         feelsLike = daily[0].feels_like.day;
         weatherDescription = daily[0].weather[0].description;
         weatherMain = daily[0].weather[0].main;
         // Check weather description to determine number of clouds
         switch (weatherDescription) {
             case 'clear sky':
                 numClouds = 100;
                 break;
             case 'few clouds':
                 numClouds = 5;
                 break;
             case 'scattered clouds':
                 numClouds = 10;
                 break;
             case 'broken clouds':
                 numClouds = 15;
                 break;
             case 'overcast clouds':
                 numClouds = 20;
                 break;
         }
         // Check weather main to see if it's raining
         switch (weatherMain) {
            case 'Thunderstorm':
                weather = 'rain';
                break;
            case 'Drizzle':
                weather = 'rain';
                break;
            case 'Rain':
                weather = 'rain';
                break;
         }
         // Check if feelsLike is hot
         if (feelsLike >= 90) {
             weather = 'sun';
             hot = true;
         } else {
             weather = 'sun';
         }
 
 
     } catch (e) {
         console.log(e.message);
     }
}
