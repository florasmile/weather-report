"use strict";
// define state objects, add variables and initial value
const state = {
  increaseTempControl: null,
  decreaseTempControl: null,
  tempValue: null,
  temp: 60,
  landscape: null,
  headerCityName: null,
  cityNameInput: null,
  cityName: "Seattle",
  currentTempButton: null,
  skySelect: null,
  sky: null,
  cityNameReset: null,
  gardenContent: null
};

// set temp text color and landscape based on temp value
const updateVisuals = () => {
  const value = state.temp;
  state.tempValue.textContent = value;
  // clear all existing classes
  state.tempValue.className = "";
  // refactor: use variables to reduce repeated codes
  let color = "";
  let landEmoji = "";

  if (value >= 80) {
    color = "red";
    landEmoji = "🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂";
  } else if (value >= 70) {
    color = "orange";
    landEmoji = "🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷";
  } else if (value >= 60) {
    color = "yellow";
    landEmoji = "🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃";
  } else if (value >= 50) {
    color = "green";
    landEmoji =  "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲";
  } else {
    color = "teal";
    landEmoji = "🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲";
  }
  state.tempValue.classList.add(color);
  state.landscape.textContent = landEmoji;
};

// define actions when clicking increase temp arrow
const increaseTempByOne = () => {
  state.temp += 1;
  updateVisuals();
};

//define actions when clicking decrease temp arrow
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
  const response = await axios.get('http://127.0.0.1:5000/location',
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
  const response = await axios.get('http://127.0.0.1:5000/weather',
    {
      params: {
        lat: lat,
        lon: lon,
        format: 'json'
      }
    });
    // get temp from response body, response.main.temp
    // convert temp from Kelvin to F unit
    return {
      temp: convertTempUnits(response.data.main.temp),
      sky: response.data.weather[0].main
    };
};

// calling APIs to get real temp
const updateRealWeather = async () => {
  try {
    // get cityName
    const cityName = state.cityNameInput.value;
    // get lat, lon from calling API
    const location = await findLatAndLon(cityName);
    // get weather and sky condition using lat, lon and calling API, update values
    const {temp, sky} = await getWeatherData(location);
    //use updated temp value to update temp color, sky and landscape
    state.temp = temp;
    state.skySelect.value = sky.toLowerCase();
    updateVisuals();
    changeSky(sky.toLowerCase());
  }
  catch (error) {
    console.log(error);
  };
};

//handle two ways to change sky: through drop down or getRealTimeWeather; 
// need to update sky and garden background color
const changeSky = (realSkyCondition=null) => {
  // get sky condition value; when there is realTime data, update sky using realSky data
  const skyCondition = realSkyCondition || state.skySelect.value;
  // remove all existing background colors
  const skyBackgroundColors = ["sunny", "cloudy", "rainy", "snowy", "stormy", "drizzly", "foggy"];
  skyBackgroundColors.forEach((color) => {
    if(state.gardenContent.classList.contains(color)) {
      state.gardenContent.classList.remove(color);
    };
  });
  // refactor: define background and emoji to reduce repeation
  let skyEmoji = "";
  let background = "";  
  // add sky based on sky condition
  if(skyCondition === "clear") {
    skyEmoji = "☁️ ☁️ ☁️ ☀️ ☁️ ☁️☀️ ☀️ ☀️ ";
    background = "sunny";
  } else if(skyCondition === "clouds"){
    skyEmoji = "☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️";
    background ="cloudy";
  }else if(skyCondition === "rain") {
    skyEmoji = "🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧";
    background = "rainy";
  }else if(skyCondition === "snow") {
    skyEmoji = "🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨";
    background = "snowy";
  }else if(skyCondition === "thunderstorm") {
    skyEmoji = "🌩⚡️⛈🌩⛈🌪🌩⛈⚡️🌪🌩⛈⚡️⛈";
    background = "stormy";
  }else if(skyCondition === "drizzle") {
    skyEmoji = "🌦💧🌦🌧🌦💧🌧🌦🌦💧🌦🌧🌦";
    background = "drizzly";
  }else if(skyCondition === "atmosphere") {
    skyEmoji = "🌫🌫🌁🌁🌫🌫🌫🌫🌫🌫🌁🌁🌫";
    background = "foggy";
  };
  state.sky.textContent = skyEmoji;
  state.gardenContent.classList.add(background);
};

const resetCityName = () => {
  // change the value in the user input box to the default cityName
  state.cityNameInput.value = state.cityName;
  // call updateCityName
  updateCityName();
}
// registerEvents, link the action to the element to change the state
const registerEvents = () => {
  state.increaseTempControl.addEventListener("click", increaseTempByOne);
  state.decreaseTempControl.addEventListener("click", decreaseTempByOne);
  state.cityNameInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      updateCityName();
    };
  });
  state.currentTempButton.addEventListener("click", updateRealWeather);
  // **cannot just add changeSky as 2nd argument
  state.skySelect.addEventListener("change", function() {
    changeSky();
  });
  state.cityNameReset.addEventListener("click", resetCityName);
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
  state.cityNameReset = document.getElementById("cityNameReset");
  state.gardenContent = document.getElementById("gardenContent");
};

const onLoaded = () => {
  loadControls();
  registerEvents();
  updateVisuals();//load landscape using initial default temp
  changeSky(); //load emoji using default (first) sky
  resetCityName();
};

// entry point
onLoaded();

