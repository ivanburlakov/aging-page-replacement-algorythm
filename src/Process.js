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
      refType = "read";
    } else {
      refType = "write";
    }

    if (this.refs === this.workingSetUpdate) {
      this.workingSet = [];
      for (i = 0; i < 5; i++) {
        this.workingSet.push({
          number: randomArrayElement(this.pageTable).number,
        });
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

    if (mmu(this.pageTable, "checkP", targetPageIndex) === 1) {
      this.pageTable = mmu(this.pageTable, refType, targetPageIndex);

      let physPageIndex;

      if (physPageTable.length > 0) {
        let physPage;
        physPage = physPageTable.pop();
        usedPhysPageTable.unshift(physPage);
        physPageIndex = 0;
      } else {
        this.pageTable = mmu(this.pageTable, refType, targetPageIndex);

        let previousParentProcessIndex;
        let previousParentProcessPageIndex;

        physPageIndex = kernel(processes, usedPhysPageTable);

        const { processNumber, pageNumber } = usedPhysPageTable[
          physPageIndex
        ].ref;

        previousParentProcessIndex = processNumber;

        previousParentProcessPageIndex = pageNumber;

        Object.assign(
          processes[previousParentProcessIndex].pageTable[
            previousParentProcessPageIndex
          ],
          {
            P: 0,
            R: 0,
            M: 0,
            physPageNumber: null,
          }
        );
      }

      Object.assign(usedPhysPageTable[physPageIndex].ref, {
        processNumber: this.number,
        pageNumber: targetPageNumber,
      });

      this.pageTable[targetPageIndex].physPageNumber =
        usedPhysPageTable[physPageIndex].number;
    }

    this.refs++;
    if (this.refs === config.processLifetimeRefs) {
      this.pageTable.forEach((el) => {
        const physPageNumber = el.physPageNumber;
        if (el.P === 0) {
          const index = usedPhysPageTable.findIndex(
            (page) => page.number === physPageNumber
          );
          physPageTable.push(usedPhysPageTable[physPageNumber]);

          usedPhysPageTable.splice(index, 1);
        }
      });
      this.finishedWorking = true;
    }
  }
}

module.exports = Process;
