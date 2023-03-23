import keys from '../keys.js';
import ChatGPT from './chatgpt.js';
import Loading from './loading.js';

class Forecast {
  constructor(data, place) {
    this.lat = data[1];
    this.lng = data[0];
    this.place = place;
    this.summary;
    this.getForecast();
  }
  async getForecast() {
    const target = document.querySelector(".sidebar-pane-wrapper");
    const loading = new Loading(target);
    loading.start();
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${this.lat}&lon=${this.lng}&exclude=minutely,hourly,alerts&units=imperial&appid=${keys.weathermap}`;
    const response = await fetch(url);
    const data = await response.json();
    this.current = data.current;
    this.daily = data.daily;
    this.timezone = data.timezone;
    this.timezone_offset = data.timezone_offset;
    //convert this.current.wind_deg to compass direction
    this.current.wind_deg = this.convertWindDirection(this.current.wind_deg);
    console.log(this);
    this.render();
    let gptSession = new ChatGPT(this);
    this.summary = await gptSession.getChat();
    this.render();
    loading.stop();
  }
  convertWindDirection(deg) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    const index = Math.round(deg / 45);
    return directions[index];
  }
  getWeatherCondition(weatherData) {
    let condition;
    if (weatherData.weather[0].main === "Clear") {
        condition = "Clear Skies";
    } else if (
      weatherData.weather[0].main === "Clouds" &&
      weatherData.clouds > 75
    ) {
      condition = "Cloudy Skies";
    } else if (
      weatherData.weather[0].main === "Clouds" &&
      weatherData.clouds < 75
    ) {
      condition = "Sunny Skies";
    } else if (
      weatherData.weather[0].main === "Rain" ||
      weatherData.weather[0].main === "Drizzle"
    ) {
      condition = "Rainy";
    } else if (weatherData.weather[0].main === "Wind") {
      condition = "Windy";
    } else if (weatherData.weather[0].main === "Fog") {
      condition = "Foggy";
    } else if (weatherData.humidity > 80) {
      condition = "Humid";
    } else if (weatherData.weather[0].main === "Snow") {
      condition = "Snowy";
    } else if (weatherData.weather[0].main === "Sleet") {
      condition = "Sleet";
    } else if (weatherData.weather[0].main === "Hail") {
      condition = "Hail";
    } else if (weatherData.weather[0].main === "Thunderstorm") {
      condition = "Thunderstorms";
    } else if (weatherData.weather[0].main === "Freezing Rain") {
      condition = "Freezing Rain";
    } else {
        condition = "Right Now"
    }
    this.updateBackground(condition);
    return condition;
  }
  getRainChances() {
    let weatherId = this.current.weather[0].id;
    let rainChances;

    switch (weatherId) {
      case 200: // thunderstorm
      case 201:
      case 202:
      case 210:
      case 211:
      case 212:
      case 221:
      case 230:
      case 231:
      case 232:
        rainChances = 100;
        break;
      case 300: // drizzle
      case 301:
      case 302:
      case 310:
      case 311:
      case 312:
      case 313:
      case 314:
      case 321:
        rainChances = 75;
        break;
      case 500: // rain
      case 501:
      case 502:
      case 503:
      case 504:
      case 511:
      case 520:
      case 521:
      case 522:
      case 531:
        rainChances = 50;
        break;
      case 600: // snow
      case 601:
      case 602:
      case 611:
      case 612:
      case 615:
      case 616:
      case 620:
      case 621:
      case 622:
        rainChances = 25;
        break;
      case 701: // mist
      case 711: // smoke
      case 721: // haze
      case 731: // sand, dust whirls
      case 741: // fog
      case 751: // sand
      case 761: // dust
      case 762: // volcanic ash
      case 771: // squalls
      case 781: // tornado
        rainChances = 10;
        break;
      case 800: // clear sky
        rainChances = 0;
        break;
      case 801: // few clouds
      case 802: // scattered clouds
      case 803: // broken clouds
      case 804: // overcast clouds
        rainChances = 5;
        break;
      default:
        rainChances = 0;
    }

    return rainChances;
  }
  updateBackground(condition) {
    const container = document.querySelector(".weather-effect-container");
    const oldVideo = document.querySelector(".weather-effect-video");
    const video = document.createElement("video");
    video.classList.add("weather-effect-video");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    const source = document.createElement("source");
    source.setAttribute("type", "video/mp4");
    video.appendChild(source);
    switch(condition) {
        case "Clear Skies":
            // change the video src on video.weather-effect-video
            source.setAttribute("src", "videos/clear-skies.mp4");
            container.appendChild(video);
            break;
        case "Cloudy":
            break;
        case "Sunny Skies":
            break;
        case "Rainy":
            source.setAttribute("src", "videos/heavy-rain.mp4");
            break;
        case "Windy":
            break;
        case "Foggy":
            break;
        case "Humid":
            break;
        case "Snowy":
            break;
        case "Sleet":
            break;
        case "Hail":
            break;
        case "Thunderstorms":
            break;
        case "Freezing Rain":
            break;
    }
    setTimeout(() => {
        // add fade-in class to video
        video.classList.add("fade-in");
        // wait .3 seconds and remove oldVideo
        if (oldVideo) {
            setTimeout(() => {
                container.removeChild(oldVideo);
            }
            , 300);
        }
    }, 500);
  }
  render() {
    // remove contents of .current-forecast-pane
    const parent = document.querySelector(".current-forecast-pane");
    parent.innerHTML = "";
    // round current.temp to nearest integer
    this.current.temp = Math.round(this.current.temp);
    // round up wind speed
    this.current.wind_speed = Math.ceil(this.current.wind_speed);
    // convert humidity to level 1-5
    let humidityLevel = 1;
    if (this.current.humidity >= 0 && this.current.humidity <= 0.9) {
        humidityLevel = 5;    
    } else if (this.current.humidity > 0.9 && this.current.humidity <= 11) {
        humidityLevel = 4;
    } else if (this.current.humidity >= 12 && this.current.humidity <= 38) {
        humidityLevel = 2;
    }
    else if (this.current.humidity > 38) {
        humidityLevel = 1;
    }

    let html = `
            <article>
                <img src="images/arnold2.webp" alt="Arnold" class="arnold">
                <h2>${'Arnold\'s Forecast'/*this.getWeatherCondition(this.current)*/}</h2>
                <p>${this.summary}</p>
            </article>
            <article class="current-temp-wrapper">
                <div class="row no-padding align-center no-gap">
                    <img src="images/degrees-icon.svg" alt="raindrop" class="weather-icon rain-icon">
                    <h2 class="current-temp">${this.current.temp}°F</h2>
                </div>
                <div class="row no-padding justify-space-between align-bottom">
                    <div class="column">
                        <div class="row no-padding align-center no-gap">
                            <img src="images/rain-icon.svg" alt="raindrop" class="weather-icon rain-icon">
                            <h3 class="current-rain">${this.getRainChances()}%</h3>
                        </div>
                    </div>
                    <div class="column align-right">
                        <p class="current-wind">Wind: ${this.current.wind_deg} ${this.current.wind_speed}mph</p>
                    </div>
                </div>
            </article>
            <article class="humidity-chart-wrapper">
                <div class="column shrink">
                    <img src="images/humidity-icon.svg" alt="raindrop" class="weather-icon rain-icon" style="max-width:unset; width: 35px; height: 30px;">
                </div>
                <div class="column curr-humidity-column">
                    <div class="humidity-chart">
                        <div class="humidity-chart-circle level-1"></div>
                        <div class="humidity-chart-circle level-2"></div>
                        <div class="humidity-chart-circle level-3"></div>
                        <div class="humidity-chart-circle level-4"></div>
                        <div class="humidity-chart-circle level-5"></div>
                    </div>
                    <h4 class="humidity-class-title">Pleasant</h4>
                    <div>
                        <div class="humidity-class">
                            <div class="humidity-chart-circle small level-5"></div>
                            <h4 class="humidity-class-title">0.00%-0.9%</h4>
                        </div>
                        <div class="humidity-class">
                            <div class="humidity-chart-circle small level-4"></div>
                            <h4 class="humidity-class-title">0.9%-11%</h4>
                        </div>
                    </div>
                </div>
                <div class="column shrink curr-humidity-column">
                    <div class="curr-humidity">
                        <div class="humidity-chart-circle small level-${humidityLevel}"></div>
                        <h3 class="curr-humidity-perc">${this.current.humidity}%</h3>
                    </div>
                    <h4 class="humidity-class-title">Muggy</h4>
                    <div>
                        <div class="humidity-class">
                            <div class="humidity-chart-circle small level-2"></div>
                            <h4 class="humidity-class-title">12%-38%</h4>
                        </div>
                        <div class="humidity-class">
                            <div class="humidity-chart-circle small level-1"></div>
                            <h4 class="humidity-class-title">39%-90%</h4>
                        </div>
                    </div>
                </div>
            </article>
            ${`<!--<article class="curr-temp-chart">
                Temp Chart
            </article>-->`}
        `;
    parent.innerHTML = html;
    document.querySelector('.page-wrapper').classList.remove('search');
    this.render7Day();
  }
  render7Day() {
    const parent = document.querySelector('#seven-day-parent');
    parent.innerHTML = "";
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    // loop through this.daily seven times
    for(let i=0; i < 7;i++){
        const forecastNode = document.createElement('div');
        forecastNode.classList.add('column', 'seven-day-forecast');
        let day = new Date(this.daily[i].dt * 1000);
        day = weekday[day.getDay()];
        if (i === 0) {
            day = 'Today';
        }
        let highTemp = 0;
        let lowTemp = 150;
        for(let key in this.daily[i].temp){
            if(this.daily[i].temp[key] > highTemp){
                highTemp = this.daily[i].temp[key];
            }
            if(this.daily[i].temp[key] < lowTemp){
                lowTemp = this.daily[i].temp[key];
            }
        }
        //round up highTemp and lowTemp
        highTemp = Math.ceil(highTemp);
        lowTemp = Math.ceil(lowTemp);
        let html = `
            <p>high ${highTemp}°F</p>
            <p>low ${lowTemp}°F</p>
            <div class="canvas-space"></div>
            <h2>${highTemp}°</h2>
            <h3>${day}</h3>
            <meter low="0" optimum="20" high="30" value="${this.daily[i].rain || 0}" min="0" max="100" class="weather-meter rain-chance"></meter>
            <meter low="0" optimum="20" high="60" value="${this.daily[i].humidity}" min="0" max="100" class="weather-meter humidity"></meter>
        `;
        forecastNode.innerHTML = html;
        parent.appendChild(forecastNode);
    }
  }
}

export default Forecast;

