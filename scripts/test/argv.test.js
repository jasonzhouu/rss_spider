// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
// });

let now = new Date()
let localtime = now.toLocaleTimeString()
let hour = localtime.slice(0,2)*1 //获取当前的小时
let minute = localtime.slice(3,5)*1 //获取当前的分钟

if(process.argv[2] == "now"){
    console.log("analyze articles now")
} else if(hour == 3){
    console.log("it's time to analyze articles")
} else {
    console.log("it's not time to ananlyze articles")
}