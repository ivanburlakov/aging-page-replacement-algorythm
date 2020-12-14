class PhysPage {
  constructor(number) {
    this.number = number;
    this.counter = 0;
    this.ref = { processNumber: null, pageNumber: null };
  }
}

module.exports = PhysPage;
