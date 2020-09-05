const {parentPort, workerData} = require('worker_threads');
const delay_second = 3;

parentPort.on("message", (param) => {
  console.log('input param '+JSON.stringify(param));
    
   var resposneData = '';
   switch(param.type){
     case 'pre-process':
       resposneData = amadeusPreProcess(param.input);
       break;
     case 'post-process':
       resposneData = amadeusPostProcess(param.input);
       break;  
   }

    parentPort.postMessage({response:resposneData});
  });

  function amadeusPreProcess(input){
    var startTime = new Date().getTime();
    while((new Date().getTime() - startTime) < (delay_second*1000)){
           //cpu heavy process
    }
    console.log('pre process completed');
    return 'pre-process-response';
  }

  function amadeusPostProcess(input){
    var startTime = new Date().getTime();
    while((new Date().getTime() - startTime) < (delay_second*1000)){
           //cpu heavy process
    }
    console.log('post process completed');
    return 'post-process-response';
  }

