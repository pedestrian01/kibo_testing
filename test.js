const looksSame = require('looks-same');
const path = require('path');


async function run(){
	const {equal} = await looksSame('1.png', '2.png');
	console.log(equal);
}

run();
