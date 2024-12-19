const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const forecastContainer = document.querySelector("#forecast");
let finalResponse;
let days;
let htmlCode;
let dates;


searchBtn.addEventListener("click", function () {
    getForecast(searchInput.value);
})

searchInput.addEventListener("input", function () {
    getForecast(this.value);
})

async function getForecast(cityOrCordinates) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a3225e0161464786858145546241712&q=${cityOrCordinates}&days=3`);
    finalResponse = await response.json();
    if (!finalResponse.error) {
        getDays();
        displayData();
    }
}

function getDays() {
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    days = [];
    dates = [new Date(finalResponse.forecast.forecastday[0].date), new Date(finalResponse.forecast.forecastday[1].date), new Date(finalResponse.forecast.forecastday[2].date)];
    for (const date of dates) {
        days.push(daysOfTheWeek[date.getDay()]);
    }
}

function displayData() {
    htmlCode = "";
    htmlCode += `
    <div class="col-md-4">
                        <div class="forecast today">
                            <div class="forecast-header" id="today">
                                <div class="day">${days[0]}</div>
                                <div class=" date">${dates[0].getDate()} December</div>
                            </div> <!-- .forecast-header -->
                            <div class="forecast-content d-flex flex-column justify-content-evenly" id="current">
                                <div class="location">${finalResponse.location.name}</div>
                                <div class="degree">
                                    <div class="num">${finalResponse.current.temp_c}<sup>o</sup>C</div>

                                    <div class="forecast-icon d-flex flex-column">
                                        <img src="${finalResponse.forecast.forecastday[0].day.condition.icon}" alt="weather condition icon"
                                            width="90">
                                    </div>

                                </div>
                                <div class="custom">${finalResponse.forecast.forecastday[0].day.condition.text}</div>
                                <div class="wind">
                                    <span class="me-3"><img src="images/icon-umberella.png" alt="an umbrella" class="me-1"> ${finalResponse.forecast.forecastday[0].day.daily_chance_of_rain} %</span>
                                    <span class="me-3"><img src="images/icon-wind.png" alt="wind" class="me-1"> ${finalResponse.forecast.forecastday[0].day.maxwind_kph} km/h</span>
                                    <span class="me-3"><img src="images/icon-compass.png" alt="wind-direction" class="me-1"> ${finalResponse.current.wind_dir}</span>
                                </div>
                            </div>
                        </div>
                    </div>
    `;

    displayAnotherData(finalResponse.forecast.forecastday[1], days[1], 'tomorrow');
    displayAnotherData(finalResponse.forecast.forecastday[2], days[2], 'after-tomorrow');
    forecastContainer.innerHTML = htmlCode;

}

function displayAnotherData(forecastObject, day, whichDay) {
    htmlCode += `
     <div class="col-md-4">
                        <div class="forecast ${whichDay}">
                            <div class="forecast-header" id="tomorrow">
                                <div class="day text-center">${day}</div>
                            </div> <!-- .forecast-header -->
                            <div class="forecast-content d-flex flex-column justify-content-evenly align-items-center">
                                <div class="forecast-icon">
                                    <img src="${forecastObject.day.condition.icon}" alt="weather condition icon" width="48">
                                </div>
                                <div class="degree">${forecastObject.day.maxtemp_c}<sup>o</sup>C</div>
                                <small>${forecastObject.day.mintemp_c}<sup>o</sup>C</small>
                                <div class="custom">${forecastObject.day.condition.text}</div>
                            </div>
                        </div>
                    </div>
    `;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function () {
            getForecast('Cairo');
        });
    }
}

async function showPosition(position) {
    const coordinates = `${position.coords.latitude},${position.coords.longitude}`;
    getForecast(coordinates);
}

getLocation();