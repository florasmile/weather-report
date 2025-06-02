"use strict";
// define state objects and add variables and their states
const state = {
  increaseTempControl: null,
  decreaseTempControl: null,
  tempValueLable: null,
}

// action: define how to want to handle events
const increaseTempByOne = () => {
  const value = parseInt(state.tempValueLable.textContent);
  value++;
  state.tempValueLable.textContent = value.toString(); 
  

}
// registerEvents, link the action to the element to change the state
//when clicked on the increaseTempControl (up arrow), we want to increase the tempValue by one 
const registerEvents = () => {
  state.increaseTempControl.addEventListener('click', increaseTempByOne);
}

const onLoaded = () => {
  loadControls();
  // setRandomDog();
  registerEvents();
}
// select HTML elements from the DOM
const loadControls = () => {
  state.increaseTempControl = document.getElementById("increaseTempControl");
  state.decreaseTempControl = document.getElementById("decreaseTempControl");
  state.tempValueLable = document.getElementById("tempValue");
}






//<script src="https://unpkg.com/axios/dist/axios.min.js"></script>