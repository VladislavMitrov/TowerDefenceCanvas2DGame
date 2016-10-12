td.Wang = function (size) {
	colors = [
	  [0,0,0,1], // 0
	  [0,0,1,1], // 1
	  [1,0,1,1], // 2
	  [1,0,0,1], // 3

	  [0,1,0,1], // 4
	  [0,1,1,1], // 5
	  [1,1,1,1], // 6
	  [1,1,0,1], // 7

	  [0,1,0,0], // 8
	  [0,1,1,0], // 9
	  [1,1,1,0], // 10
	  [1,1,0,0], // 11

	  [0,0,0,0], // 12
	  [0,0,1,0], // 13
	  [1,0,1,0], // 14
	  [1,0,0,0]  // 15
	];

	function randInt(min, max){
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	var width = size*5;
	var height = size*5;
	var tails = [[]];

	tails[0][0]=randInt(0,16);
	for(let x=1; x<width; x++){
		let found = false;
		let N = -1;
		do{
			N++;
			tail = N % 15;
			if(colors[tail][0] == colors[tails[0][x-1]][2] && randInt(0,1)){
				tails[0].push(tail);
				found = true;
				N = -1;
			}
		}while(!found);
	}

	for(let y=1; y<height; y++){
		tails.push([]);
		let found = false;
		let N = -1;
		do{
			N++;
			tail = N % 15;
			if(colors[tail][1] == colors[tails[y-1][0]][3] && randInt(0,1)){
				tails[y].push(tail);
				found = true;
				N = -1;
			}
		}while(!found);
	}
	for(let y=1;y<height;y++){
		for(let x=1;x<width;x++){
			//console.log(x,y)
			let found = false;
			let N = -1;
			do{
				N++;
				tail = N % 15;
				if(colors[tail][0] == colors[tails[y][x-1]][2] && colors[tail][1] == colors[tails[y-1][x]][3] && randInt(0,1)){
					tails[y].push(tail);
					found = true;
					N = -1;
				}
			}while(!found);
		}
	}
	return tails;
}