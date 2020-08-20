const {parentPort, workerData} = require('worker_threads');


parentPort.on("message", (param) => {
    console.log('input param '+param.delay);
    
    var startTime = new Date().getTime();
    while((new Date().getTime() - startTime) < (param.delay*1000)){

    }
    var waitSec = (new Date().getTime() - startTime)/1000;
  
    console.log('wait sec '+waitSec);
    // return the result to main thread.
    parentPort.postMessage({wait:waitSec});
  });


