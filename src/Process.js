const config = require("../config/config.js");
const {
  kernel,
  mmu,
  chance,
  randomInteger,
  generateClassObjectArray,
  randomArrayElement,
  randomArrayIndex,
} = require("./functions.js");
const PTE = require("./PTE.js");

class Process {
  constructor(number) {
    this.number = number;
    this.refs = 0;
    this.workingSetUpdate = 0;
    this.pageTable = generateClassObjectArray(PTE, config.virtualPages);
    this.workingSet = [];
    this.finishedWorking = false;
  }

  work(processes, physPageTable, usedPhysPageTable) {
    let refType;
    let targetPageNumber;
    let targetPageIndex;

    if (chance(50)) {
      refType = 'read'
    } else {
      refType = 'write'
    }

    this.pageTable = mmu(this.pageTable, 'aging')

    if (this.refs === this.workingSetUpdate) {
      this.pageTable.sort((a, b) => b.R - a.R);
      this.workingSet = [];
      for (i = 0; i < 5; i++) {
        this.workingSet.push({ number: this.pageTable[i].number });
      }
      this.workingSetUpdate += config.changeWorkingSetRefs;
    }

    if (chance(90)) {
      targetPageNumber = randomArrayElement(this.workingSet).number;
    } else {
      targetPageNumber = randomArrayElement(this.pageTable).number;
    }

    targetPageIndex = this.pageTable.findIndex(
      (page) => page.number === targetPageNumber
    );

    this.pageTable = mmu(this.pageTable, refType, targetPageIndex)

    if (mmu(this.pageTable, 'checkP', targetPageIndex)) {
      let physPageIndex;

      if (physPageTable.length > 0) {
        let physPage;
        physPage = physPageTable.pop();
        usedPhysPageTable.unshift(physPage);
        physPageIndex = 0;
      } else {
        let previousParentProcessIndex;
        let previousParentProcessPageIndex;

        physPageIndex = kernel(processes, usedPhysPageTable);

        previousParentProcessIndex =
          usedPhysPageTable[physPageIndex].ref.processNumber;

        previousParentProcessPageIndex =
          usedPhysPageTable[physPageIndex].ref.pageNumber;

        processes[previousParentProcessIndex].pageTable[
          previousParentProcessPageIndex
        ].P = 0;
        processes[previousParentProcessIndex].pageTable[
          previousParentProcessPageIndex
        ].R = 0;
        processes[previousParentProcessIndex].pageTable[
          previousParentProcessPageIndex
        ].M = 0;
        processes[previousParentProcessIndex].pageTable[
          previousParentProcessPageIndex
        ].physPageNumber = null;
      }

      usedPhysPageTable[physPageIndex].ref.processNumber = this.number;
      usedPhysPageTable[physPageIndex].ref.pageNumber = targetPageNumber;
      this.pageTable[targetPageIndex].physPageNumber =
        usedPhysPageTable[physPageIndex].number;
    }

    this.pageTable.sort((a, b) => b.R - a.R);
    this.refs++;
    if (this.refs === config.processLifetimeRefs) {
      this.finishedWorking = true;
    }
  }
}

module.exports = Process;
