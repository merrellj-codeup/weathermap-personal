import keys from './keys.js';
import Forecast from './classes/forecast.js';
import Result from './classes/result.js';

const testToggle = document.querySelector('.toggle-button');
const searchInput = document.querySelector('#search-input');

// Add event listener to toggle button
testToggle.addEventListener('click', () => {
    // Toggle "search" class on .page-wrapper
    document.querySelector('.page-wrapper').classList.toggle('search');
});

mapboxgl.accessToken = keys.mapbox;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
    center: [-98.59, 29.42], // starting position [lng, lat]
    zoom: 10 // starting zoom
});
new Forecast([-98.59, 29.42], 'San Antonio');

// Add onfocus event listener to searchInput
searchInput.addEventListener('focus', () => {
    // add "search" class to .page-wrapper
    document.querySelector('.page-wrapper').classList.add('search');
});

// Add debounce function
const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

// UUIDv4 function
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Generate UUID for session
const sessionID = generateUUID();

// Add oninput event listener to searchInput
searchInput.addEventListener('input', debounce((e) => {
    // Get search term
    const searchTerm = e.target.value;

    // Clear results
    document.querySelector('.location-search-pane').innerHTML = '';

    // If search term is empty, return
    if (!searchTerm) {
        return;
    }

    //url encode search term
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    
    // Make fetch to Mapbox API
    // only get cities
    // only relevance of .75 or higher
    const searchParams = new URLSearchParams({
        access_token: mapboxgl.accessToken,
        autocomplete: true,
        limit: 10,
        types: 'place',
        fuzzyMatch: true,
        language: 'en',
        country: 'us',
        proximity: '-98.59,29.42',
    });
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedSearchTerm}.json?${searchParams}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.features.forEach(result => {
                new Result(result, map);
            });
            // trigger click event on first result
            document.querySelector('.location-result').click();
        });
}));

// Create the data array
var data = [
    {x: 0, y: 20},
    {x: 1, y: 25},
    {x: 2, y: 30},
    {x: 3, y: 35},
    {x: 4, y: 40},
    {x: 5, y: 45},
    {x: 6, y: 50},
];

// function drawLineGraph(dataPoints) {
//     // Get the canvas element
//     var canvas = document.getElementById("tempChart");
//     // Get the canvas context
//     var ctx = canvas.getContext("2d");
//     // Set the line color
//     ctx.strokeStyle = "#FF0000";
//     // Set the line width
//     ctx.lineWidth = 2;
//     for (var i = 1; i < dataPoints.length; i++) {
//         ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
//       }
//     // Move to the first point
//     ctx.moveTo(dataPoints[0].x, dataPoints[0].y);
//     // Draw the line for each point
//     for (var i = 1; i < dataPoints.length; i++) {
//       ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
//     }
//     // Stroke the line
//     ctx.stroke();
// }

// drawLineGraph(data);