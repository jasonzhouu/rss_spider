const { spawn } = require('child_process')
var pythonProcess = spawn('python3', ["../../../content-analysis/TopControl.py"])

pythonProcess.stdout.on('data', function (data) { 
    console.log('standard output:\n' + data); 
}); 

pythonProcess.stderr.on('data', function (data) { 
    console.log('standard error output:\n' + data); 
}); 

pythonProcess.on('exit', function (code, signal) { 
    console.log('child process eixt ,exit:' + code); 
});