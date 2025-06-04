"use strict";
// define state objects and add variables and their states
const state = {
  increaseTempControl: null,
  decreaseTempControl: null,
  tempValue: null,
  temp: 60,
  landscape: null,
  headerCityName: null,
  cityNameInput: null,
  currentTempButton: null,
  skySelect: null,
  sky: null
};


const updateVisuals = () => {
  const value = state.temp;
  state.tempValue.textContent = value;
  state.tempValue.className = "";

  if (value >= 80) {
    state.tempValue.classList.add("red");
    state.landscape.textContent = "🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂";
  } else if (value >= 70) {
    state.tempValue.classList.add("orange");
    state.landscape.textContent = "🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷";
  } else if (value >= 60) {
    state.tempValue.classList.add("yellow");
    state.landscape.textContent = "🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃";
  } else if (value >= 50) {
    state.tempValue.classList.add("green");
    state.landscape.textContent = "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲";
  } else {
    state.tempValue.classList.add("teal");
    state.landscape.textContent = "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲";
  }
};


// action: define how to want to handle events
const increaseTempByOne = () => {
  state.temp += 1;
  updateVisuals();
};

const decreaseTempByOne = () => {
  state.temp -= 1;
  updateVisuals();
};

const updateCityName = () => {
  // read cityname from input text box
  const cityName = state.cityNameInput.value; 
  // add cityName to headerCityName
  state.headerCityName.textContent = cityName;
};

//input: cityName
// output: location<>
const findLatAndLon = async (cityName) => {
  const response = await axios.get('http://localhost:5000/location',
    {
      params: {
        q: cityName,
        format: 'json'
      }
    });
  const { lat, lon } = response.data[0]; //use destructuring
  return {
    lat: lat,
    lon: lon
  };
};

//helper method: convert temp from Kelvin unit to Fahrenheit
const convertTempUnits = (kelvin) => {
  return Math.round(1.8 * (kelvin-273) + 32);
}

const getWeatherData = async ({ lat, lon }) => {
  // const { lat, lon } = location;
  const response = await axios.get('http://localhost:5000/weather',
    {
      params: {
        lat: lat,
        lon: lon,
        format: 'json'
      }
    });
    // get temp from response body, response.main.temp
    // convert temp from Kelvin to F unit
    return convertTempUnits(response.data.main.temp);
};
// calling APIs to get real temp
const getRealTemp = async () => {
  try {
    // get cityName
    const cityName = state.cityNameInput.value;
    // edge case: what is cityName = ""
    // get lat, lon from calling API
    const location = await findLatAndLon(cityName);
    // console.log(location);
    // get weather using lat, lon and calling API
    const temp = await getWeatherData(location);
    // verify response from weather data and get temp
    return temp;
  }
  catch (error) {
    console.log(error);
  };
};

const updateRealTemp = async () => {
    const temp = await getRealTemp();
     // update tempValue
    state.temp = temp;
    updateVisuals();
  } 

const changeSky = () => {
  // get sky condition value
  const skyCondition = state.skySelect.value;
  // add sky based on sky condition
  if(skyCondition === "clear") {
    state.sky.textContent = "☁️ ☁️ ☁️ ☀️ ☁️ ☁️";
  } else if(skyCondition === "clouds"){
    state.sky.textContent = "☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️";
  }else if(skyCondition === "rain") {
    state.sky.textContent = "🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧";
  }else if(skyCondition === "snow") {
    state.sky.textContent = "🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨";
  }
};
// registerEvents, link the action to the element to change the state
//when clicked on the increaseTempControl (up arrow), we want to increase the tempValue by one 
const registerEvents = () => {
  state.increaseTempControl.addEventListener('click', increaseTempByOne);
  state.decreaseTempControl.addEventListener("click", decreaseTempByOne);
  state.cityNameInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      updateCityName();
    }
  })
  state.currentTempButton.addEventListener("click", updateRealTemp);
  state.skySelect.addEventListener("change", changeSky);
};


// select HTML elements from the DOM
const loadControls = () => {
  state.increaseTempControl = document.getElementById("increaseTempControl");
  state.decreaseTempControl = document.getElementById("decreaseTempControl");
  state.tempValue = document.getElementById("tempValue");
  state.landscape = document.getElementById("landscape");
  state.headerCityName = document.getElementById("headerCityName");
  state.cityNameInput = document.getElementById("cityNameInput");
  state.currentTempButton = document.getElementById("currentTempButton");
  state.skySelect = document.getElementById("skySelect");
  state.sky = document.getElementById("sky");
};


const onLoaded = () => {
  loadControls();
  registerEvents();
  updateVisuals();
  changeSky();
};


// document.addEventListener("DOMContentLoaded", onLoaded);
onLoaded();

