td.Enemies = function(enemyTypes) {
	this.enemyTypes = enemyTypes;
	this.active = [];
	this.enemyQueue = [];
	this.waves = [];
	this.nextWaveTime = 5000.0;
	this.maxQueueSize = 100;
	this.spawnInterval = 1000.0;
	this.nextSpawn = 0.0;
	this.endTime = 0;
	td.Enemies.enemyCount = 0;
	td.Enemies.spawning = 0;

};
td.Enemies.prototype.check = function(x,y) {
	function checkInRect (xp,yp,fullSize,ex,ey) {
		size = fullSize/2.5 + 2;
		this.x1 = ex + size;
		this.y1 = ey + size;
		this.x2 = ex - size;
		this.y2 = ey - size;
		if(xp > this.x2 && xp < this.x1 && yp > this.y2 && yp < this.y1){
			return true;
		} else {
			return false;
		}
	}
	for(var i = this.active.length - 1; i!=0 ; i--){
		if(checkInRect(x,y,this.active[i].size,this.active[i].x,this.active[i].y))
			return i;
	}
};

td.Enemies.prototype.setupWaves = function(waves, map) {
	this.waves = waves;
	// Queue up the first wave
	this.spawnWave(this.waves[0], map);
	this.waves.splice(0, 1);
};

td.Enemies.prototype.spawnWave = function(wave, map) {
	var type = 0;
	for (var i = 0; i < wave.enemies.length; i++) {
		type = wave.enemies[i];
		var newEnemy = new td.Enemy(3, 0, map, this.enemyTypes[type]);
		newEnemy.spawnTime = this.endTime  + this.enemyTypes[type].size + i  * this.spawnInterval;
		this.addToQueue(newEnemy);
	}
	td.Enemies.spawning++;
	gameWave.textContent = td.Enemies.spawning;
};

td.Enemies.prototype.addToQueue = function (enemy) {
	if (this.enemyQueue.length < this.maxQueueSize) {
		this.enemyQueue.push(enemy);
		td.Enemies.enemyCount++;
	}
};

td.Enemies.prototype.spawn = function(enemy) {
	// If there's an unused enemy in the array then use that space
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 1) {
			this.active[i] = enemy;
			return;
		}
	}
	// otherwise add it to the end
	this.active.push(enemy);
};

td.Enemies.prototype.update = function(dt, map, ct, player) {
	// Is it time to spawn the next guy?
	var waitTimer = Math.floor((this.endTime - ct)/1000);
	if(waitTimer>=0){
		nextWaveTimer.style.display = 'block';
		untilNextWave.style.display = 'block';
		nextWaveTimer.textContent = waitTimer + " с.";
	} else {
		untilNextWave.style.display = 'none';
		nextWaveTimer.style.display = 'none';
	}
	if (this.enemyQueue.length > 0 && this.enemyQueue[0].spawnTime <= ct) {
		this.spawn(this.enemyQueue[0]);
		this.enemyQueue.splice(0,1);
	} else if (this.enemyQueue.length == 0 && this.waves.length > 0 && td.Enemies.enemyCount == 0) {
	// If this wave is over then lets queue up the next wave
		this.endTime = ct + 5000;
		player.giveMoney(Math.floor(map.goalHp*td.Enemies.spawning/2));
		untilNextWave.style.display = 'block';
		nextWaveTimer.textContent = "5";
		this.spawnWave(this.waves[0], map);
		this.waves.splice(0, 1);
	}
	if (td.Enemies.enemyCount == 0 && this.enemyQueue.length == 0 && this.waves.length == 0){
		window.fsm.changeState(window.win);
	}

	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 0) {
			this.active[i].update(dt, map, player);
			if (this.active[i].hp <= 0) {
				this.finished = 1;
			}
		}
	}
};