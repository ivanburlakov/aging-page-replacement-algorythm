module.exports = {
  chance: (targetPercentage) => {
    const result = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    if (result <= targetPercentage) {
      return true;
    }
    return false;
  },

  randomInteger: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  generateClassObjectArray: (El, quantity) => {
    const array = [];
    for (i = quantity - 1; i >= 0; i--) {
      array.unshift(new El(i));
    }
    return array;
  },

  randomArrayElement: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  },

  randomArrayIndex: (array) => {
    return Math.floor(Math.random() * array.length);
  },

  kernel: (processes, usedPhysPageTable) => {
    return usedPagesSorted.length - 1;
  },

  mmu: (pageTable, request, targetPageIndex, processes) => {
    if (request === "checkP") {
      return pageTable[targetPageIndex].P
    } else if (request === "aging") {
      pageTable.forEach(el => {
        el.counter >>> 1;
        el.counter += processes[el.ref.processNumber].PageTable[el.ref.pageNumber] << 30;
        processes[el.ref.processNumber].PageTable[el.ref.pageNumber].R = 0;
      })
      pageTable.sort((a, b) => b.counter - a.counter);
      return {pageTable, processes};
    } else if (request === "read") {
      pageTable[targetPageIndex].R = 1;
      return pageTable;
    } else if (request === "write") {
      pageTable[targetPageIndex].R = 1;
      pageTable[targetPageIndex].M = 1;
      return pageTable;
    }
  },
};
