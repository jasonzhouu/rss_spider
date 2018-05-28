const { exec } = require('child_process')

function exec_python() {
    exec('python3 TopControl.py', (error, stdout, stderr)=>{
        console.log('standard output:\n',stdout);
        if(error) {
            console.info('standard error output:\n'+stderr);
        }
    })
}

module.exports = exec_python 