const { exec } = require('child_process')

exec('python3 ../../../content-analysis/TopControl.py', (error, stdout, stderr)=>{
    console.log('standard output:\n',stdout);
    if(error) {
        console.info('standard error output:\n'+stderr);
    }
})