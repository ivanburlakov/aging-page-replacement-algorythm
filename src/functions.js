module.exports = {
  mmu: (pageTable, request, targetPageIndex) => {
    if (request === "checkP") {
      if (pageTable[targetPageIndex].P === 0) {
        return 0
      }
      return 1;
    } else if (request === "aging") {
      pageTable.forEach((page) => {
        page.R = page.R >>> 1;
      });
      return pageTable;
    } else if (request === "read") {
      pageTable[targetPageIndex].R += 128;
      return pageTable;
    } else if (request === "write") {
      pageTable[targetPageIndex].R += 128;
      pageTable[targetPageIndex].M = 1;
      return pageTable;
    }
  },

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
    let usedPagesSorted = [];

    usedPhysPageTable.forEach((page) => {
      usedPagesSorted.push({
        number: page.number,
        ref: page.ref,
        R: processes[page.ref.processNumber].pageTable[page.ref.pageNumber].R,
      });
    });

    usedPagesSorted = usedPagesSorted.sort((a, b) => a.R - b.R);
    const physPageNumber = usedPagesSorted[0].number;
    physPageIndex = usedPhysPageTable.findIndex(
      (page) => page.number === physPageNumber
    );

    return physPageIndex;
  },
};
