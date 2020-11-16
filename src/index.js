import config from '../config.js'
let Page = require("./Page.js");

function OS(pageQuantity) {
  const bootTime = Date.now();

  const pageTable = [];

  generatePages();

  // Tick таймер на кожні 20 мс.
  setInterval(Tick, 20);
}

function Process() {
  setTimeout();
}

function Tick() {
  pageTable.forEach((el) => el.reset());
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePages() {
  for (i = pageQuantity; i > 0; i--) {
    pageTable.push(new Page());
  }
}

// Запускаемо ОС
OS(20);