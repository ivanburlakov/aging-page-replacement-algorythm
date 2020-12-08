
  const config = require("../config/config.js");
  const { generateClassObjectArray } = require("./functions.js");
  const PhysPage = require("./PhysPage.js");
  const Process = require("./Process.js");

  function os() {
    let memoryRefs = 0;
    let physPageTable = generateClassObjectArray(
      PhysPage,
      config.physicalPages
    );
    let usedPhysPageTable = [];
    let processes = [];
    let activeProcesses = 0;
    let processCreateTime = 3;

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
            processCreateTime += 3;
          }

          if (!processes[currentProcessIndex].finishedWorking) {
            // What to do with process
            processes[currentProcessIndex].work(
              processes,
              physPageTable,
              usedPhysPageTable,
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
