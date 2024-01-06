const userLocation = document.querySelector('#location');
const userCountry= document.querySelector('#country');
const form = document.getElementById('weatherForm');
const temperaturelbl = document.querySelector('h1');
const temperatureBox = document.getElementById('tempBox');
const weatherCondition = document.getElementById('condition');
const submitBtn = document.getElementById('btnSubmit');
const loader = document.getElementById('spinner');
var weatherData;

async function handleSubmit(e) {
    e.preventDefault();

    if (userLocation.value == '' || userCountry.value == '') {
        alert('Please fill in all fields');
        setToDefault();
        return;
    }
    else if (userLocation.value === userCountry.value) {
        setToDefault();
        alert('Location not found');
        return;
    }

    const LocationQuery = createURLString(userLocation.value);
    const CountryQuery = userCountry.value;
    const GeoURL = `https://us1.locationiq.com/v1/search?key=pk.6d92096f904b7cc313f5bb852ca75c0c&q=${LocationQuery}&format=json`;
    
    loadSpinner();
    try {
        const mapRes = await fetch(GeoURL);
        stopSpiner();
        if (!mapRes.ok) {
          alert('Location not found');
          setToDefault();
        return;
        }

        const mapData = await mapRes.json();

        const targetLocation = mapData.find(location => location.display_name.includes(CountryQuery));
        const lat = new Number(targetLocation.lat).toFixed(4);
        const lon = new Number(targetLocation.lon).toFixed(4);

        weatherData = await getLocationWeatherData(lat, lon);
    
        renderDOM(weatherData);
    } catch (error) {
       alert('Server Error');
    }
}

async function getLocationWeatherData(lat, lon) {
    const URL = `http://api.weatherapi.com/v1/current.json?key=da4d5e9872d341dd96c120051230609&q=${lat},${lon}`;
    const res = await fetch(URL);
    const data = await res.json();
    console.log(data.current);
    return data;
}

function renderDOM(weatherData) {
    const currentTemperature = weatherData.current.temp_c;
    const currentCondition = weatherData.current.condition.text.toLowerCase();
    temperaturelbl.innerText = `${currentTemperature}\u{00B0}C`;
    weatherCondition.innerHTML = `${currentCondition}`;
    temperatureBox.style.display = 'block'; 

    switch(currentCondition){
        case 'sunny': {
            temperatureBox.style.backgroundColor = 'darkgoldenrod';
            form.style.borderColor = 'darkgoldenrod';
            submitBtn.style.backgroundColor = 'darkgoldenrod';
            document.body.style.backgroundImage = 'url(./img/2.jpg)';
            break;
        }
        case 'cloudy':
        case 'partly cloudy': {
            temperatureBox.style.backgroundColor = 'grey';
            form.style.borderColor = 'grey';
            submitBtn.style.backgroundColor = 'grey';
            document.body.style.backgroundImage = 'url(./img/cloudy.jpg)';    
            break;
        }
        case 'clear': {
            temperatureBox.style.backgroundColor = 'green';
            form.style.borderColor = 'green';
            submitBtn.style.backgroundColor = 'green';  
             document.body.style.backgroundImage = 'url(./img/1.jpg)'; 
            break;
        }
        default: {
            temperatureBox.style.backgroundColor = 'dodgerblue';
            form.style.borderColor = 'dodgerblue';
            submitBtn.style.backgroundColor = 'dodgerblue';
            break;
        }

    }
}

function createURLString(value) {
    return value.replace(' ','%');
}

function loadSpinner(){
    loader.style.display = 'block';
    submitBtn.setAttribute('disabled', true);
}

function stopSpiner(){
    loader.style.display = 'none';
    submitBtn.removeAttribute('disabled');
}

function setToDefault() {
    document.body.style.backgroundImage = 'none';
    temperatureBox.style.display = 'none';
    form.style.borderColor = '#00aeff';
    submitBtn.style.backgroundColor = '#00aeff';
}
const init = () => {
    form.addEventListener('submit', handleSubmit);
}

document.addEventListener('DOMContentLoaded', init);




