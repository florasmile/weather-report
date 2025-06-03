"use strict";
// define state objects and add variables and their states
const state = {
  increaseTempControl: null,
  decreaseTempControl: null,
  tempValue: null,
  temp: 60,
  landscape: null,
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


// registerEvents, link the action to the element to change the state
//when clicked on the increaseTempControl (up arrow), we want to increase the tempValue by one 
const registerEvents = () => {
  state.increaseTempControl.addEventListener('click', increaseTempByOne);
  state.decreaseTempControl.addEventListener("click", decreaseTempByOne);
};


// select HTML elements from the DOM
const loadControls = () => {
  state.increaseTempControl = document.getElementById("increaseTempControl");
  state.decreaseTempControl = document.getElementById("decreaseTempControl");
  state.tempValue = document.getElementById("tempValue");
  state.landscape = document.getElementById("landscape");
};


const onLoaded = () => {
  loadControls();
  registerEvents();
  updateVisuals();
};


document.addEventListener("DOMContentLoaded", onLoaded);



//<script src="https://unpkg.com/axios/dist/axios.min.js"></script>