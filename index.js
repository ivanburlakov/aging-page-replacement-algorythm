const config = require("./config/config.js");
const { generateClassObjectArray, mmu } = require("./src/functions.js");
const PhysPage = require("./src/PhysPage.js");
const Process = require("./src/Process.js");

function os() {
  let memoryRefs = 0;
  let physPageTable = generateClassObjectArray(PhysPage, config.physicalPages);
  let usedPhysPageTable = [];
  let processes = [];
  let activeProcesses = 0;
  let processCreateTime = config.processCreateTime;
  let agingShiftTime = config.agingShiftTime;

  processes.push(new Process(processes.length));
  activeProcesses++;

  // All processes loop
  while (activeProcesses > 0) {
    // Each process quant loop
    let currentProcessIndex = 0;
    while (currentProcessIndex < processes.length) {
      let quant = 0;

      while (quant < config.quantRefs) {
        // Create new process when it's time to
        if (
          processes.length < config.maxProcessQuantity &&
          memoryRefs === processCreateTime
        ) {
          processes.push(new Process(processes.length));
          activeProcesses++;
          processCreateTime += config.processCreateTime;
        }

        if (memoryRefs === agingShiftTime) {
          const result = mmu(usedPhysPageTable, "aging", null, processes);
          usedPhysPageTable = result.pageTable;
          processes = result.processes;
          agingShiftTime += config.agingShiftTime;
        }

        if (!processes[currentProcessIndex].finishedWorking) {
          // What to do with process
          processes[currentProcessIndex].work(
            processes,
            physPageTable,
            usedPhysPageTable
          );
        } else {
          // Process finished work, removing
          activeProcesses--;
          break;
        }
        memoryRefs++;
        quant++;
      }
      currentProcessIndex++;
    }
  }
  console.log("Processes successfully finished working.");
}

// Launching OS
os();
