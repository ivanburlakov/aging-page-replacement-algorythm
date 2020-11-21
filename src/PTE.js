class PTE {
  constructor(number) {
    this.P = 0;
    this.R = 0;
    this.M = 0;
    this.number = number;
    this.physPageNumber = null;
  }
}

module.exports = PTE;