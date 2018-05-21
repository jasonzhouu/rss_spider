var countdownInterval, time_per_round = 3
function countdown(time_per_round) {
    console.log('time remain: ', time_per_round, ' seconds')
    countdownInterval = setInterval(()=>{
        console.log('time remain: ', --time_per_round, ' seconds')
        if (time_per_round == 0) {
            clearInterval(countdownInterval)
        }
    }, 1000)
}


function new_around() {
    console.log('\n ================= \n    new around    \n ================= \n')
    clearInterval(countdownInterval)
    countdown(time_per_round)
}

new_around()
setInterval(new_around, time_per_round*1000)