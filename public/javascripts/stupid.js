var planet , hole, toolbar, canvas, ctx, water = [],
	trees = [],
	clouds = [],
	peoples = [],
	lights = [],
	stops = [],
	touch_angle = null,//ghost
	snow_angle = null,//snow
	light_angle = null,//light
	point = null,
	flashReady = false,
	loadedImages = 0,
	snow_angle_rate = null,
	water_angle_rate = null,
	flash_angle = null,
	over_time = 120,
	all_score = 0,
	kill_onetime = 0,
	kill_num = 0,
	clouds_angle = [],
	clouds_num = 0,
	allInterval = null,
	screenWidth = document.documentElement.clientWidth,
	screenHeight = document.documentElement.clientHeight;

/*Math circle*/
Math.Radian = function( angel )    {    return angel*this.PI/180;                }
Math.Angel = function( radian )    {    return radian*180/this.PI;                }
Math.Sin = function( angel )    {    return this.sin( this.Radian( angel ) );    }
Math.Asin = function( nums )    {    return this.Angel( this.asin( nums ) );    }
Math.Cos = function( angel )    {    return this.cos( this.Radian( angel ) );    }
Math.Acos = function( nums )    {    return this.Angel( this.acos( nums ) );    }
Math.Tan   = function( angel )    {    return this.tan( this.Radian( angel ) );    }
Math.Atan = function( nums )    {    return this.Angel( this.atan( nums ) );    }
Math.Atan2 = function( x, y )        {    return this.Angel( this.atan2( y, x ) );    }
Math.Pol = function( x, y )        {    return [ this.sqrt( x*x + y*y ), this.Atan2( x, y ) ];        }
Math.Rec  = function( dist, angel )    {    return [ dist*this.Cos( angel ), dist*this.Sin( angel ) ];    }

var settings = {
 
 	now_time : 0,
 	statr_time : 0,
 	world_speed : 1000 / 25,
	atmosphere_height: Math.min(parent.innerHeight/6, 130),
	atmosphere_growth: 0.001,
	atmosphere_max: 0.1,
	gravity: 0.3,
	soak_rate: 0.05,
	cool_rate: 0.5,
	melt_rate: 0.01,
	dry_rate: 0.01,
	max_trees: 10,
	tree_spread: 18,
	spin_rate: 0.1,
	growth_rate: 1,
	tree_height: 45,
	branch_size: 15,
	branch_growth: 0.3,
	max_fruit: 1,
	fruit_rot: 1000,
	fruit_growth: 0.2,
	fruit_age: 400,
	fruit_size: 4,
	fruit_gravity: 0.5,
	freeze_rate: 0.1,
	snow_height: 2,
	drown_time: 100,
	cloud_chance: 1000,
	fade_rate: 0.01,
	cloud_cutoff: 15,
	rain_time: 50,
	rain_rate: 10,

	people_speed: 0.5,
	people_num : 20,
	people_height : 70,
	people_die_height : 90,
	people_slow_rate : 0.8,
	people_fast_rate_min : 1.5,
	people_fast_rate_max : 2,
	people_snow_speed : 0.4,

	/*toolbar*/
	snow_cd : 1,
	light_cd : 5,
	stop_cd : 15,

	flash_height : 150,
	light_num : 1,
	light_speed : 0.5,

	holex : document.documentElement.clientWidth / 2 - 60,
	holey : 5,
	hole_speed : 6,

	full_time : 120,
	timebar_x : 1100,
	timebar_y : 10,

	time_fill : '#AAAAAA',
	water_colour: 'rgba(40, 160, 220, 0.4)',
	water_ground: '#59BCFF',
	cold_core_colour: '#A1A1A1',
	core_colour: '#FCCD49',
	wet_soil_colour: '#7A4500',
	tree_colour: '#8F5424',
	branch_colours: ['#83DE28', '#ABCF51', '#9BD604', '#76C967', '#3D942E'],
	branch_dead_colour: '#C29D38',
	fruit_colours: ['#FF0000', '#DE1F6C', '#E87E46', '#DE4112', '#F27F1B'],
	rotten_fruit_colour: 'rgba(131, 179, 0,',
	btn_bg_color : '#3e4548',
	btn_cd_color : '22B1FE',

	img_ele:{
		people :'/images/people.png',
		flash :'/images/flash.png',
		stop : '/images/stop.png',
		die : '/images/die.png',
		hole : '/images/hole.png',
		snow_cd :'/images/snow_cd.png',
		light_cd : '/images/light_cd.png',
		stopl_cd : '/images/stopl_cd.png',
		doublek : '/images/double.png',
		trible : '/images/trible.png',
		god:'/images/god.png',
		mons:'/images/mons.png'
	},
	img_url:[]
};

document.onselectstart = function(e) {
	return false;
}

var Loop = function() {

	//var time = new Date().getTime();
	ctx.clear();
	settings.now_time = Math.round((new Date()).getTime() / 1000);
	if(settings.statr_time == 0)settings.statr_time = settings.now_time;

	var i = water.length;
	while (i--) {
		if (water[i].update()) water[i].draw();
	}

	toolbar.update();
	toolbar.draw();

	var i = trees.length;
	while (i--) {
		trees[i].update();
		trees[i].draw();
	}

	var i = clouds.length;
	while (i--) {
		if (clouds[i].update()) clouds[i].draw();
	}

	if(hole.update() && peoples.length < settings.people_num) hole.draw();
	var i = peoples.length;
	while(i--){
		if(peoples[i].update()){ 
			peoples[i].draw();
			peoples[i].isKill();
		}
	}

	planet.update();
	planet.draw();

	var i = lights.length;
	while(i--){
		if(lights[i].update()) lights[i].draw();
	}

	var i = stops.length;
	while(i--){
		if(stops[i].update()) stops[i].draw();
	}
	
	//console.log(new Date().getTime() - time);
};

var Utils = {

	circle_angle: function(x, y, r, a) {//通过星球的x、y、r来计算某一点的坐标
		var xc = Math.cos(a * (Math.PI / 180)) * r + x;
		var yc = Math.sin(a * (Math.PI / 180)) * r + y;
		return {
			x: xc,
			y: yc
		};
	},

	alter_angle: function(a, n) {//角度增加，判断是否增加过
		var angle = a + n;
		if (angle < 0) angle = 360 + angle;
		if (angle > 360) angle = angle - 360;
		return angle;
	},

	in_angle: function(angle1, angle2, range) {//角度1和角度2之间的差，与range的关系
		var diff = angle1 - angle2;

		return Math.abs(diff % 360) <= range || (360 - Math.abs(diff % 360)) <= range;
	},

	chance: function(number) {//比例、机会
		return (Math.random() * number < 1);
	},

	distance: function(point1, point2) {//pow :x的y次幂 sqrt平方根.....两个点，求它们的直线距离
		return (Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)));
	},

	random: function(min, max) {//随机函数，min与max
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	random_negative : function(){
		return Math.random() < 0.5 ? 1 : -1;
	},

	trans_angle: function(pointa){
		var tana = Math.floor(Math.abs(planet.y - pointa.y) / Math.abs(planet.x - pointa.x)*100)/100;
		var angle = Math.Atan(tana);
		if(pointa.y < planet.y && pointa.x <= planet.x){
			angle += 180;
		}else if(pointa.y < planet.y && pointa.x > planet.x){
			angle = 360 - angle;
		}else if(pointa.y > planet.y && pointa.x < planet.x){
			angle = 180 - angle;
		}
		return angle;
	}
};

var Light = function(angle){

	this.angle = angle;
	this.img = settings.img_url['flash'];
	this.cutx = 0;
	this.cuty = 0;
	this.zhen = 8;
	this.level = 0;
	this.die = false;
}

Light.prototype.update = function(){

	//this.angle = Utils.alter_angle(this.angle, settings.light_speed);
	return true;
}

Light.prototype.draw = function(){
	
	if(this.die == false){

		flash_angle = this.angle;

		var moveXY = Utils.circle_angle(
			planet.x,
			planet.y,
			planet.r + 65,
			this.angle);

		ctx.save();
		ctx.translate(moveXY.x, moveXY.y);
		ctx.rotate((this.angle + 90) * Math.PI / 180);
		ctx.translate(-moveXY.x, -moveXY.y);
		ctx.drawImage( this.img, this.cutx, this.cuty, 150, 150, moveXY.x - 65, moveXY.y - 65, 150, 150);
		ctx.restore();
		if(this.level == 0){
			if(this.cutx < 1050){
				this.cutx += settings.flash_height;
			}else{
				this.cuty += settings.flash_height;
				this.level = 1;
			}
		}else{
			if(this.cutx > 150){
				this.cutx -= settings.flash_height;
			}else{
				this.cuty -= settings.flash_height;
				this.die = true;
				flash_angle = null
			}
		}
	}else{
		lights.pop();
	}
}

var Toolbar = function(){
	/*this.treebtn_x = 50;
	this.treebtn_y = 200;
	this.btn_r = 28;
	this.tree_img = settings.img_url[3];
	this.tree_center_x = this.treebtn_x + this.btn_r;
	this.tree_center_y = this.treebtn_y + this.btn_r;
	this.tree_angle = 360;
	this.click = 0;*/

	this.snowbtn_x = 10;
	this.snowbtn_y = 10;
	this.btn_r = 28;
	this.snow_img = settings.img_url['snow_cd'];
	this.snow_center_x = this.snowbtn_x + this.btn_r;
	this.snow_center_y = this.snowbtn_y + this.btn_r;
	this.snow_angle = 360;

	this.lightbtn_x = 80;
	this.lightbtn_y = 10;
	this.light_img = settings.img_url['light_cd'];
	this.light_center_x = this.lightbtn_x + this.btn_r;
	this.light_center_y = this.lightbtn_y + this.btn_r;
	this.light_angle = 360;

	this.stopbtn_x = 150;
	this.stopbtn_y = 10;
	this.stop_img = settings.img_url['stopl_cd'];
	this.stop_center_x = this.stopbtn_x + this.btn_r;
	this.stop_center_y = this.stopbtn_y + this.btn_r;
	this.stop_angle = 360;

	this.timeBtn_x = 220;
	this.timeBtn_y = 10;
	this.timebtn_r = 30;
	this.time_center_x = screenWidth - 50;
	this.time_center_y = this.timeBtn_y + this.timebtn_r;
	this.time_angle = 0;
	this.a_sec = parseInt(1000 / settings.world_speed);
	this.time_light = false;
	this.light_end = 5;
}

Toolbar.prototype.setTimeLight = function(){
	this.time_light = true;
}

Toolbar.prototype.update = function(){
	/*if(point != null){
		if(Utils.distance(point,{x:this.tree_center_x,y:this.tree_center_y}) <= 45){//点击树木按钮
			if(this.tree_angle == 360){
				this.click = 1;
				if(this.tree_img == settings.img_url[3]){
					this.tree_img = settings.img_url[4];
					this.addTreeAction();
				}else{
					this.tree_img = settings.img_url[3];
					this.clearActions();
					this.click = 0;
				}
				point = null;
			}
		}
	}*/
}

Toolbar.prototype.set_snow_angle = function(){
	this.snow_angle = 0;
}

Toolbar.prototype.get_snow_angle = function(){
	return this.snow_angle;
}

Toolbar.prototype.set_light_angle = function(){
	this.light_angle = 0;
}

Toolbar.prototype.get_light_angle = function(){
	return this.light_angle;
}

Toolbar.prototype.set_stop_angle = function(){
	this.stop_angle = 0;
}

Toolbar.prototype.get_stop_angle = function(){
	return this.stop_angle;
}

Toolbar.prototype.clearActions = function(){
	canvas.onmousemove = null;
}

Toolbar.prototype.draw = function(){
	if(this.snow_angle < 360){
		this.snow_angle += settings.snow_cd;
	}else if(this.snow_angle == 360){
		this.snow_img = settings.img_url['snow_cd'];
	}
	ctx.circle(this.snow_center_x,this.snow_center_y,this.btn_r,settings.btn_bg_color);
	ctx.anglecircle(this.snow_center_x,this.snow_center_y,this.btn_r,settings.btn_cd_color,this.snow_angle);
	ctx.drawImage(this.snow_img,this.snowbtn_x,this.snowbtn_y);

	if(this.light_angle < 360){
		this.light_angle += settings.light_cd;
	}else if(this.light_angle == 360){
		this.light_img = settings.img_url['light_cd'];
	}
	ctx.circle(this.light_center_x,this.light_center_y,this.btn_r,settings.btn_bg_color);
	ctx.anglecircle(this.light_center_x,this.light_center_y,this.btn_r,settings.btn_cd_color,this.light_angle);
	ctx.drawImage(this.light_img,this.lightbtn_x,this.lightbtn_y);

	if(this.stop_angle < 360){
		this.stop_angle += settings.stop_cd;
	}else if(this.stop_angle == 360){
		this.stop_img = settings.img_url['stopl_cd'];
	}
	ctx.circle(this.stop_center_x,this.stop_center_y,this.btn_r,settings.btn_bg_color);
	ctx.anglecircle(this.stop_center_x,this.stop_center_y,this.btn_r,settings.btn_cd_color,this.stop_angle);
	ctx.drawImage(this.stop_img,this.stopbtn_x,this.stopbtn_y);

	var time = parseInt(settings.now_time - settings.statr_time);
	ctx.circle(this.time_center_x,this.time_center_y,this.timebtn_r,settings.btn_bg_color);
	ctx.anglecircle(this.time_center_x,this.time_center_y,this.timebtn_r,settings.btn_cd_color,this.time_angle + time * 3); // 360度 ＝ 120 * 3
	
	// Time Number Layout
	var offset = 21;
	var showtime = over_time - time;
	if(showtime < 100 && showtime >= 10){
		offset = 12;
	}else if(showtime < 10){
		offset = 6;
	}

	ctx.font = "25px Arial";
	ctx.fillStyle = "#fff";
	if(this.time_light == true){
		this.time_light = false;
		ctx.fillStyle = "#ff6600";
	}	
	if(showtime <= 0){
		showtime = 0;
		//Time on
		gameResult();
	}
	ctx.fillText(showtime, this.time_center_x - offset, this.time_center_y + 10);
}

var Hole = function(){
	this.x = settings.holex;
	this.y = settings.holey;
	this.speed = settings.hole_speed;
	this.angle = 0;
	this.img = settings.img_url['hole'];
}

Hole.prototype.update = function(){

	this.angle = Utils.alter_angle(this.angle,this.speed);
	return true;
}

Hole.prototype.draw = function(){

	ctx.save();
	ctx.translate(this.x+61, this.y+61);
	ctx.rotate(this.angle * Math.PI / 180);
	ctx.translate(-this.x-61, -this.y-61);
	ctx.drawImage( this.img, 0, 0, 121, 121, this.x, this.y, 121, 121);
	ctx.restore();
}

var Stop = function(angle){

	this.angle = angle;
	this.img = settings.img_url['stop'];
	this.width = 100;
	this.zhen = 24;
	this.foot_num = 0;
	this.foot_rate = 1;
	this.cutx = 0;
	this.cuty = 0;
}

Stop.prototype.update = function(){
	return true;
}

Stop.prototype.draw = function(){
	var moveXY = Utils.circle_angle(
		planet.x,
		planet.y,
		planet.r + 33,
		this.angle);
	ctx.save();
	ctx.translate(moveXY.x, moveXY.y);
	ctx.rotate((this.angle + 92) * Math.PI / 180);
	ctx.translate(-moveXY.x, -moveXY.y);
	ctx.drawImage( this.img, this.cutx, this.cuty, this.width, this.width, moveXY.x - 33, moveXY.y - 33, this.width, this.width);
	ctx.restore();
	this.foot_num++;
	if(this.foot_num == this.foot_rate + 1){
		if(this.cutx < this.width * (this.zhen - 2)){
			this.cutx += this.width;
		}else{
			stops.splice(stops.indexOf(this), 1);
		}
		this.foot_num = 0;
	}
}

var People = function(angle,type){

	this.angle = angle;
	this.status = 0; //0:normal 1:fast 2:turn 3:snow

	var rand = settings.people_slow_rate;
	if(this.status == 1){
		rand = Utils.random(settings.people_fast_rate_min,settings.people_fast_rate_max);
	}

	this.img = settings.img_url['people'];
	this.dead = false;
	this.dire = Utils.random_negative();//-1:left 1:right
	this.speed = settings.people_speed * rand;
	this.foot_num = 0;
	this.foot_rate = 1;
	this.cutx = 0;
	this.cuty = 0;
	this.level = 0;
	this.isScard = 0;
	this.turn_num = 0;
	this.setTime = null;
	this.kill = false;
	if(this.dire == -1){
		this.cuty = settings.people_height;
	}
}

People.prototype.update = function(){
	
	/*反向逃跑*/
	var _this = this;
	if(touch_angle != null && this.status != 3){
		if(Utils.in_angle(this.angle,touch_angle,20)){
			this.isScard = 1;
			this.status = 1;
			setTimeout(function(){
				_this.turn_num = 0;
				_this.isScard = 0;
			},50);
		}
	}

	if(this.isScard == 1 && this.turn_num == 0){
		var scardnum = Utils.random(1,2);
		//Vedio("scard"+scardnum);
		if(touch_angle > this.angle){
			this.dire = -1;
		}else{
			this.dire = 1;
		}

		if(this.dire == 1){
			this.cuty = 4 * settings.people_height;
		}else{
			this.cuty = 5 * settings.people_height;
		}

		if(this.status == 1){
			setTimeout(function(){
				_this.status = 1;
				_this.speed = settings.people_speed * Utils.random(settings.people_fast_rate_min,settings.people_fast_rate_max);
			},50);
		}
		this.isScard = 0;
		this.turn_num = 1;
	}

	if(this.status == 1){
		if(this.setTime == null){
			this.setTime = setTimeout(function(){
					_this.status = 0;
					_this.speed = settings.people_speed * settings.people_slow_rate;
					_this.cuty = _this.cuty - settings.people_height * 4;
					_this.setTime = null;
			},2000);
		}
	}

	/*雪球*/
	if(snow_angle_rate != null){
		clearTimeout(this.setTime);
		this.setTime = null;
		if(this.angle >= snow_angle_rate.min && this.angle <= snow_angle_rate.max){
			if(this.status == 1){
				//Vedio("cold");
				this.cuty = this.cuty - settings.people_height * 2;
			}else if(this.status == 0){
				//Vedio("cold");
				this.cuty = this.cuty + settings.people_height * 2;
			}
			this.status = 3;
			this.speed = settings.people_speed * settings.people_snow_speed;
		}else if(this.status == 3 && (this.angle < snow_angle_rate.min || this.angle > snow_angle_rate.max)){
			this.cuty = this.cuty - settings.people_height * 2;
			this.status = 0;
			this.speed = settings.people_speed * settings.people_slow_rate;
		}
	}else{
		if(this.status == 3){
			this.cuty = this.cuty - settings.people_height * 2;
			this.status = 0;
			this.speed = settings.people_speed * settings.people_slow_rate;
		}
	}

	if(flash_angle != null){
		if(flash_angle - 10 <= this.angle && flash_angle +10 >= this.angle && this.dead == false){
			this.dead = true;
			this.img = settings.img_url['die'];
			//this.speed = 0;
			this.cutx = 0;
			this.cuty = 0;
			var dienum = Utils.random(1,4);
			//Vedio("die"+dienum);
		}
	}

	this.angle = Utils.alter_angle(this.angle, this.speed * this.dire);
	return true;
}

People.prototype.isKill = function(){

	if(this.kill == true){
		peoples.splice(peoples.indexOf(this), 1);
		all_score++;
		kill_onetime++;
		kill_num++;
		var sett = setTimeout(function(){
			kill_onetime = 0;
		});

		if( kill_onetime > 2){
			all_score += Math.pow(kill_onetime,2);
			toolbar.setTimeLight();
			over_time += kill_onetime;
			kill_onetime = 0;
			clearTimeout(sett);
		}
		//杀敌人数
		//putInResData(kill_num,all_score);

		return true;
	}
	return false;
}

People.prototype.draw = function(){

	if(this.dead == false){
		var moveXY = Utils.circle_angle(
			planet.x,
			planet.y,
			planet.r + 30,
			this.angle);

		ctx.save();
		ctx.translate(moveXY.x, moveXY.y);
		ctx.rotate((this.angle + 90) * Math.PI / 180);
		ctx.translate(-moveXY.x, -moveXY.y);
		ctx.drawImage( this.img, this.cutx, this.cuty, 70, 70, moveXY.x - 30, moveXY.y - 30, 70, 70);
		ctx.restore();
		this.foot_num++;
		if(this.foot_num == this.foot_rate){
			if(this.cutx < 2700){
				this.cutx += settings.people_height;
			}else{
				this.cutx = 0;
			}
			this.foot_num = 0;
		}
	}else{
		var moveXY = Utils.circle_angle(
			planet.x,
			planet.y,
			planet.r + 40,
			this.angle);
		ctx.save();
		ctx.translate(moveXY.x, moveXY.y);
		ctx.rotate((this.angle + 90) * Math.PI / 180);
		ctx.translate(-moveXY.x, -moveXY.y);
		ctx.drawImage( this.img, this.cutx, this.cuty, 90, 90, moveXY.x - 40, moveXY.y - 40, 90, 90);
		ctx.restore();
		this.foot_num++;
		if(this.foot_num == this.foot_rate + 1){
			if(this.cutx < 2250){
				this.cutx += settings.people_die_height;
			}else{
				this.kill = true;
			}
			this.foot_num = 0;
		}
	}
}

//------------------------------------------------------------------

var Planet = function(x, y, r) {//圆心与半径

	this.x = x;
	this.y = y;
	this.r = r;

	this.colour = '#BF6D02';

	this.water_level = r;
	this.water_depth = r;
	this.snow_level = r;
	this.core_size = r / 3;
	this.atmosphere = 0;//天气

	this.frozen = false;//是否结冰
};

Planet.prototype.addTree = function() {//增加一棵树:随机选出树得位置，然后检查位置是否有树，没有则生长

	var angle = Math.floor(Math.random() * 360);

	for (var i = 0; i < trees.length; i++) {

		var tree = trees[i];

		if (Utils.in_angle(angle, tree.angle, settings.tree_spread)) return;
	}

	trees.push(
	new Tree(angle,null));
};

Planet.prototype.addStop = function() {//增加一棵树:随机选出树得位置，然后检查位置是否有树，没有则生长

	var angle = touch_angle;

	for (var i = 0; i < stops.length; i++) {

		var stop = stops[i];

		if (Utils.in_angle(angle, stop.angle, settings.tree_spread)) return;
	}

	stops.push(
		new Stop(angle)
	);
	setTimeout(function(){
		touch_angle = null;
	},50);
};

Planet.prototype.addPeople = function(){
	peoples.push(
		new People(270,0)
	);
	//Vedio("born");
}

Planet.prototype.addLight = function(){
	//Vedio("flash");
	lights.push(
		new Light(90)
	);
}

Planet.prototype.update = function() {//water_depth:水离地心的沁入深度
	/*

	if (this.core_size > 0) {

		if (this.water_level > this.r) {//water_lever:水在地面的高度

			this.water_level = Math.max(this.water_level - settings.soak_rate, this.r);//按比例让土壤变干
			this.water_depth = Math.max(this.water_depth - settings.soak_rate, 0);//按比例让水位下降
		}

		if (this.water_depth < this.r) {

			if (trees.length < settings.max_trees && this.core_size && this.water_level <= this.r) {

				if (this.atmosphere < settings.atmosphere_max) this.atmosphere += settings.atmosphere_growth;

				if (Utils.chance(200)) {
					this.addTree();
				}
			}

			this.water_depth += settings.dry_rate;//水干枯的速度
		}

		if (this.water_depth <= this.core_size) this.core_size -= settings.cool_rate;//天气寒冷的速度，地心的死亡速度

		else if (this.core_size < this.r / 3 && this.core_size > 0) this.core_size += settings.melt_rate;
		//地心自我恢复
	} else {//冬天

		this.frozen = true;

		if (this.water_level > this.r) {

			this.water_level = Math.max(this.water_level - settings.soak_rate, this.r);
			this.water_depth = Math.max(this.water_depth - settings.soak_rate, 0);

			if (this.snow_level > this.r) {//雪和水在一起，雪应该下降
				this.snow_level = Math.max(this.snow_level - settings.freeze_rate, this.r);
			}

		} else {

			if (this.snow_level <= this.water_level + settings.snow_height) this.snow_level += settings.freeze_rate;

			else if (this.snow_level > this.water_level + 4) this.snow_level -= settings.freeze_rate;
		}
	}
	*/

	if (trees.length < settings.max_trees) {

		if (this.atmosphere < settings.atmosphere_max) this.atmosphere += settings.atmosphere_growth;

		if (Utils.chance(100)) {
			this.addTree();
		}
	}

	if(peoples.length < settings.people_num){

		if(Utils.chance(50)) {
			this.addPeople();
		}
	}

	if (this.atmosphere >= settings.atmosphere_max) {//天气运作到极限天气以后，随机出现云朵

		if (Utils.chance(settings.cloud_chance)) {

			clouds.push(
			new Cloud());
		}
	}

	if(snow_angle != null && toolbar.get_snow_angle() == 360){
		clouds.push(
			new Cloud(snow_angle));
		snow_angle = null;
	}else{
		snow_angle = null;
	}

	if( touch_angle != null){
		this.addStop();
	}
};

Planet.prototype.draw = function(middle) {

	if (this.atmosphere > 0) {

		ctx.circle(
		this.x,
		this.y,
		this.r + settings.atmosphere_height,
			'rgba(70, 180, 240, ' + this.atmosphere.toFixed(2) + ')');
	}

	if (this.snow_level > this.r) {

		ctx.circle(
		this.x,
		this.y,
		this.snow_level,
			'#FFF');
	}

	if (this.water_level > this.r) {

		ctx.circle(
		this.x,
		this.y,
		this.water_level,
		settings.water_colour);
	}

	if (this.water_depth < this.r) {

		ctx.circle(
		this.x,
		this.y,
		this.r,
		settings.wet_soil_colour);

		ctx.circle(
		this.x,
		this.y,
		this.water_depth,
		this.colour);

	} else {

		ctx.circle(
		this.x,
		this.y,
		this.r,
		this.colour);
	}

	if (this.core_size < this.r / 3) {

		ctx.circle(
		this.x,
		this.y,
		this.r / 3,
		settings.cold_core_colour);
	}

	if (this.core_size > 0) {

		ctx.circle(
		this.x,
		this.y,
		this.core_size,
		settings.core_colour);
	}
};

//---------------------------------------------------------

var Water = function(x, y, r, snow, gravity) {
	this.x = x;
	this.y = y;
	this.r = r;  //水滴与星球的距离，云朵下雨的距离
	this.vx = 0;
	this.vy = 0;
	this.absorb = false;
	this.snow = snow || false;
	this.gravity = gravity || settings.gravity;
};

Water.prototype.update = function() {

	var _this = this;
	if (this.r < 1) {
		water.splice(water.indexOf(this), 1);
		return false;
	}

	if (this.absorb) {//下雨

		this.r -= 1;

		//if (planet.water_level < planet.r + settings.atmosphere_height) planet.water_level += 0.2;

		return false;
	}

	var dist = Utils.distance(this, planet);//点和星球之间的距离
	var dist_x = planet.x - this.x;
	var dist_y = planet.y - this.y;

	var cos = dist_x / dist;
	var sin = dist_y / dist;

	var force = this.gravity * ((this.r * 2) * (planet.r * 2)) / Math.pow(dist, 2);

	this.vx += (cos * force);
	this.vy += (sin * force);

	if (dist < planet.r - this.r) {

		if (!this.snow) this.absorb = true;
		else this.r = 0;
	}

	this.x += this.vx;
	this.y += this.vy;

	return true;
};

Water.prototype.draw = function() {

	if (this.absorb) return;

	var colour = (this.snow) ? "#FFF" : settings.water_colour;

	ctx.circle(this.x, this.y, this.r, colour);
};

//--------------------------------------------------------------------

var Tree = function(angle,fast) {

	this.angle = angle;
	this.height = 0;
	this.max_height = settings.tree_height + Math.random() * 4;
	this.branches = [];
	this.width = 2;
	this.dying = 0;
	this.dead = false;
	this.colour = settings.branch_colours[Math.floor(Math.random() * settings.branch_colours.length)];
	this.fast = fast;
};

Tree.prototype.addBranch = function() {//灌木丛

	var angle = (this.branches.length * 3 > 3) ? -3 : this.branches.length * 3;
	var dist = (this.branches.length > 0) ? 1.5 : 1;//灌木高度

	this.branches.push(
	new Branch(
	this,
	angle,
	planet.r + (this.height / dist)));
};

Tree.prototype.update = function() {

	this.angle = Utils.alter_angle(this.angle, settings.spin_rate);//星球转动。星球上物体转动即可

	if (this.dying > settings.drown_time) this.dead = true;

	if (this.dead) return;

	//if (!planet.core_size || planet.water_depth >= planet.r) {//星球事件，造成树木死亡
	//	this.dying += 0.01;
	//	return;
	//}

	//if (planet.water_level <= planet.r + this.height) {//水分正在供给树木，不会死亡

		this.dying = 0;

		if (this.height < this.max_height) {//树木成长
			var growspeed = this.fast == null ? settings.growth_rate : settings.growth_rate * this.fast;
			this.height += growspeed;
		}

		if (this.height >= this.max_height && this.branches.length < 3) {//灌木生长

			if (!this.branches.length || this.branches[this.branches.length - 1].grown) this.addBranch();
		}

	//} else if (this.height > 2) this.dying++;//高度大于2的树木，没有水会自己死亡
};

Tree.prototype.draw = function() {

	ctx.shape(
	[
	Utils.circle_angle(
	planet.x,
	planet.y,
	planet.r,
	Utils.alter_angle(this.angle, -this.width)),
	Utils.circle_angle(
	planet.x,
	planet.y,
	planet.r + this.height,
	this.angle),
	Utils.circle_angle(
	planet.x,
	planet.y,
	planet.r,
	Utils.alter_angle(this.angle, this.width))],
	settings.tree_colour);

	var i = this.branches.length;
	while (i--) {
		this.branches[i].update();
		this.branches[i].draw();
	}
};

//-----------------------------------------------------

var Branch = function(tree, angle, dist) {//灌木丛
	this.tree = tree;
	this.r = 0;
	this.angle = angle;
	this.dist = dist;
	this.fruit = [];
	this.snow_height = 0;

	/* checks */
	this.snow = false;
	this.grown = false;
};

Branch.prototype.update = function() {
	
	var coord = Utils.circle_angle(//计算出灌木的坐标
	planet.x,
	planet.y,
	this.dist,
	Utils.alter_angle(this.tree.angle, this.angle));

	this.x = coord.x;
	this.y = coord.y;

	if (planet.core_size <= 0 && planet.water_level < planet.r + this.tree.height) {//下雪

		this.snow = true;

		if (this.snow_height < settings.snow_height) this.snow_height += settings.freeze_rate;

		var coord = Utils.circle_angle(
		planet.x,
		planet.y,
		this.dist + this.snow_height,
		Utils.alter_angle(this.tree.angle, this.angle));

		this.snowx = coord.x;
		this.snowy = coord.y;
	} else {//化雪

		if (this.snow_height > 0) {
			this.snow_height -= settings.freeze_rate;

			var coord = Utils.circle_angle(
			planet.x,
			planet.y,
			this.dist + this.snow_height,
			Utils.alter_angle(this.tree.angle, this.angle));

			this.snowx = coord.x;
			this.snowy = coord.y;
		} else this.snow = false
	}

	if (this.tree.dead) return;

	if (this.r < settings.branch_size) this.r += settings.branch_growth;//灌木长大
	else this.grown = true;//已经长大

	if (this.grown && this.fruit.length < settings.max_fruit) {//长水果

		if (Utils.chance(800)) {
			this.fruit.push(
			new Fruit(this));
		}
	}
};

Branch.prototype.draw = function() {

	if (this.snow) {

		ctx.circle(
		this.snowx,
		this.snowy,
		this.r,
			"#FFF");
	}

	ctx.circle(
	this.x,
	this.y,
	this.r, (this.tree.dead) ? settings.branch_dead_colour : this.tree.colour);

	var i = this.fruit.length;
	while (i--) {
		if (this.fruit[i].update()) this.fruit[i].draw();
	}
};

//---------------------------------------------------------------------

var Fruit = function(branch) {

	this.branch = branch;
	this.r = 0;
	this.age = 0;
	this.on_tree = true;
	this.vx = 0;
	this.vy = 0;
	this.rotten = false;
	this.alpha = 1;
	this.colour = settings.fruit_colours[Math.floor(Math.random() * settings.fruit_colours.length)];
};

Fruit.prototype.update = function() {

	if (this.on_tree) {

		if (this.age > settings.fruit_age) {

			this.on_tree = false;
			return true;
		}

		this.x = this.branch.x;
		this.y = this.branch.y;

		if (this.r < settings.fruit_size && !this.branch.tree.dead) this.r += settings.fruit_growth;//长大
		else this.age++;//长大完成

	} else {//下落

		this.age++;

		if (this.age > settings.fruit_rot) {
			this.rotten = true;

			if (this.age > settings.fruit_rot + 1000) {

				this.alpha = Math.max(0, this.alpha - settings.fade_rate);//水果是否腐败

				if (this.alpha <= 0) {//水果删去
					this.branch.fruit.splice(this.branch.fruit.indexOf(this), 1);
					return false;
				}
			}
		}

		var dist = Utils.distance(this, planet);
		var dist_x = -this.x + planet.x;
		var dist_y = -this.y + planet.y;
		var dist_real = dist - (this.r + planet.r);

		var cos = dist_x / dist;
		var sin = dist_y / dist;

		var force = settings.fruit_gravity * ((this.r * 2) * (planet.r * 2)) / Math.pow(dist, 2);

		if (dist < planet.water_level) {
			this.vx += (cos * force) / 3;
			this.vy += (sin * force) / 3;
		} else {
			this.vx += (cos * force);
			this.vy += (sin * force);
		}

		if (dist_real < 0) {
			this.x += (cos * (dist_real / 2));
			this.y += (sin * (dist_real / 2));
			this.vx += (cos * dist_real);
			this.vy += (sin * dist_real);

			if (dist > planet.water_level) {
				this.vx *= 0.8;
				this.vy *= 0.8;
			} else {
				this.vx *= 0.1;
				this.vy *= 0.1;
			}
		}

		var coord = Utils.circle_angle(
		planet.x,
		planet.y,
		dist,
		this.branch.tree.angle + this.branch.angle);

		this.x = coord.x;
		this.y = coord.y;

		this.x += this.vx;
		this.y += this.vy;
	}

	return true;
};

Fruit.prototype.draw = function() {

	var colour = (this.rotten) ? settings.rotten_fruit_colour + this.alpha + ')' : this.colour;
	ctx.circle(this.x, this.y, this.r, colour);
};

var Cloud = function(angle) {

	this.freze = false;
	if(typeof angle == 'undefined')this.angle = Math.floor(Math.random() * 360);
	else{
		this.angle = angle/2;
		this.freze = true;
		toolbar.set_snow_angle(0);
	}
	this.parts = [];
	this.height = settings.atmosphere_height - (5 + Math.floor(Math.random() * 5));
	this.raining = false;
	this.rain = 0;
	this.dead = false;
	this.alpha = 0;
	this.rgba = 'rgba(0, 0, 0,';
	this.freze_ag = this.angle;
};

Cloud.prototype.update = function() {
	if(this.freze == true)this.freze_ag = Utils.alter_angle(this.freze_ag, settings.spin_rate/2);
	this.angle = Utils.alter_angle(this.angle, settings.spin_rate);//自转
	if (planet.water_level > planet.r + settings.cloud_cutoff) this.dead = true;

	if (this.dead) {

		if (this.alpha <= 0) {
			clouds.splice(clouds.indexOf(this), 1);
			return false;
		}
		snow_angle_rate = null;

		this.alpha = Math.max(0, this.alpha - settings.fade_rate);//云消失
		return true;

	} else {

		if (this.alpha < 0.6) {
			this.alpha = Math.min(1, this.alpha + settings.fade_rate);//云出现
		}
	}

	if (!this.parts.length) {

		for (var i = 0; i <= Utils.random(3, 10); i++) {//出现随机小云朵
			this.parts.push({
				angle: this.angle + Utils.random(-3, 3),
				height: this.height + Utils.random(-2, 2),
				radius: Utils.random(10, 15)
			});
		}
	} else {
		if (this.freze == true)this.rgba = 'rgba(255, 255, 255,';
		if (Utils.chance(10)) this.raining = true;
		if (this.raining && Utils.chance(settings.rain_rate)) {
			var part = this.parts[Utils.random(0, this.parts.length - 1)];
			water.push(//云里下雨
			new Water(
			part.x + Utils.random(-part.radius * 0.5, part.radius * 0.5),
			part.y + Utils.random(-part.radius * 0.5, part.radius * 0.5),
			4,
			this.freze,
			settings.gravity * 5));
			this.rain++;
		}

		if(this.freze == true){
			this.drawGroud();
		}

		if (this.rain > settings.rain_time || (this.freze == true && this.rain > settings.rain_time / 1.5)) {
			this.dead = true;
		}
	}

	return true;
};

Cloud.prototype.drawGroud = function(){
	snow_angle_rate = {
		min : this.freze_ag * 2 - 10,
		max : this.freze_ag * 2 + 10
	};

	clouds_angle[clouds_num] = snow_angle_rate;
	clouds_num++;

	ctx.drawcircle(planet.x,planet.y,planet.r,snow_angle_rate.min,snow_angle_rate.max,"rgba(255,255,255,1)");
	//console.log(snow_angle_rate);
}

Cloud.prototype.water_ground = function(){
	water_angle_rate = {
		min : this.angle - 90 - 20,
		max : this.angle - 90 + 20,
	};
	console.log(water_angle_rate);
	ctx.drawcircle(planet.x,planet.y,planet.r,water_angle_rate.min,water_angle_rate.max,settings.water_ground);
}

Cloud.prototype.draw = function() {

	var i = this.parts.length;
	while (i--) {

		var part = this.parts[i];

		var coord = Utils.circle_angle(
		planet.x,
		planet.y,
		planet.r + part.height,
		this.angle + part.angle);

		part.x = coord.x;
		part.y = coord.y;

		ctx.circle(
		coord.x,
		coord.y,
		part.radius,
			this.rgba + this.alpha + ')');

	}
};

var Vedio = function(type){

	var dom = null;
	this.vedio = {
		die1:"/sounds/die-1.ogg",
		die2:"/sounds/die-2.ogg",
		die3:"/sounds/die-3.ogg",
		die4:"/sounds/die-4.ogg",
		born:"/sounds/born.ogg",
		cold:"/sounds/cold.ogg",
		flash:"/sounds/flash.ogg",
		scard1:"/sounds/jingxia-1.ogg",
		scard2:"/sounds/jingxia-2.ogg"
	};
	if(type == "flash")dom = $("#flash");
	play(this.vedio[type]);
	function play(url,dom){
		var div = dom == null ? document.getElementById('sounds') : dom;
	    div.innerHTML = '<embed src="'+url+'" loop="0" autostart="true" hidden="true" type="audio/ogg"></embed>';
	}
}

window.onload = function() {

	canvas = document.getElementById('c');
	ctx = canvas.getContext('2d');
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;

	ctx.circle = function(x, y, r, c) {//画圆
		this.beginPath();
		this.arc(
		x,
		y,
		r,
		0,
		Math.PI * 2);
		this.fillStyle = c;
		this.fill();
	};

	ctx.anglecircle = function(x,y,r,c,angle){
		this.beginPath();
		this.arc(
		x,
		y,
		r,
		0,
		angle*Math.PI/180,false);
		this.strokeStyle = c;
		this.lineWidth = "5";
		this.stroke();
	}

	ctx.drawcircle = function(x,y,r,anglestart,anglend,color){
		this.beginPath();
		this.arc(
		x,
		y,
		r,
		anglestart*Math.PI/180,
		anglend*Math.PI/180,false);
		this.strokeStyle = color;
		this.lineWidth = "3";
		this.stroke();
	}

	ctx.shape = function(points, c) {//画形状

		this.beginPath();

		this.moveTo(points[0].x, points[0].y);

		for (var i = 1, l = points.length; i < l; i++)
		this.lineTo(points[i].x, points[i].y)

		this.closePath();

		this.fillStyle = c;
		this.fill();
	};

	ctx.clear = function() {
		this.fillStyle = '#333';
		this.fillRect(0, 0, canvas.width, canvas.height);
	};

	canvas.onmousedown = function(e) {

	   	var rect = canvas.getBoundingClientRect();
   		var point =  {
   			x: e.clientX - rect.left,
   			y: e.clientY - rect.top
   		}

		canvas.onmousemove = function(e){
			var rect = canvas.getBoundingClientRect();
	   		var mopoint =  {
	   			x: e.clientX - rect.left,
	   			y: e.clientY - rect.top
	   		}

	   		if(Utils.distance(point,mopoint) > 100){
				flashReady = true;
	   		}
		}

		canvas.onmouseup = function(e){

			var rect = canvas.getBoundingClientRect();
	   		var upoint =  {
	   			x: e.clientX - rect.left,
	   			y: e.clientY - rect.top
	   		}
	   		var pdis = Utils.distance(point, planet),
	   			udis = Utils.distance(upoint, planet),
	   			point_dis = Utils.distance(point, upoint);

			if( flashReady == true ){

				var fpoint = {
					x : (point.x + upoint.x) / 2,
					y : (point.y + upoint.y) / 2
				}
				
				if(pdis > udis && toolbar.get_light_angle() >= 360 ) {
					light_angle = Utils.trans_angle(fpoint);
					lights.push(
						new Light(light_angle)
					);
					toolbar.set_light_angle();
				} else if(pdis < udis) {
					toolbar.set_stop_angle();
					touch_angle = Utils.trans_angle(point);
				}
			} else if( udis <= planet.r * 2 ) {
				snow_angle = Utils.trans_angle(point);
			}
			canvas.onmousemove = null;
			flashReady = false;
		}
	};

	var numImages = 0;
	for (var src in settings.img_ele) {    
        numImages++;    
    }

    loadedImages = 0;
    var namecount = 0;
    var namearr = [];
    for(var j in settings.img_ele){
    	namearr[namecount] = j;
    	namecount++;
    	imgReady(settings.img_ele[j],function(){
    		settings.img_url[this.id] = this;
    		loadedImages++;
    		if(loadedImages == numImages){
				if (canvas.width >= canvas.height){
					planet = new Planet(
						canvas.width/2,
						canvas.height/2,
						canvas.height/3
					);
				} else {
					settings.holey = canvas.height / 2 - ( canvas.height/3.2 );
					planet = new Planet(
						canvas.width/2,
						canvas.height/2,
						canvas.height/4.5
					);
				}

    			hole = new Hole();
				toolbar = new Toolbar();
                allInterval = setInterval(Loop, settings.world_speed);//循环绘制世界 
    			console.log(settings.img_url);
            }
    	},j);
    }

	/*var i = 10;//初始化水滴
	while (i--)
	water.push(
	new Water(
	Math.random() * canvas.width,
	Math.random() * canvas.height,
	Math.random() * 10 + 4));*/

	/* Mobile Touch */
	var flashReady = false,
		upoint,
		point;
	var supportsOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange == 'object'),
		temp_orien;
	
	document.body.addEventListener('touchstart', onTouchStart,false);
	document.body.addEventListener('touchmove', onTouchMove, false);
   	document.body.addEventListener('touchend', onTouchEnd, false)
   	window.addEventListener('orientationchange', updateOrientation, false);  

   	function updateOrientation(){
		window.location.reload();
   	}

	function onTouchMove(e){
	    upoint =  {
   			x: e.touches[0].clientX,
   			y: e.touches[0].clientY
   		}

   		if(Utils.distance(point,upoint) > 100){
			flashReady = true;
   		}
   	}

   	function onTouchEnd(e){
   		var pdis = Utils.distance(point, planet),
   			udis = Utils.distance(upoint, planet),
   			point_dis = Utils.distance(point, upoint);

		if( flashReady == true ){

			var fpoint = {
				x : (point.x + upoint.x) / 2,
				y : (point.y + upoint.y) / 2
			}
			
			if(pdis > udis && toolbar.get_light_angle() >= 360) {
				toolbar.set_light_angle();
				light_angle = Utils.trans_angle(fpoint);
				lights.push(
					new Light(light_angle)
				);
			} else if(pdis < udis) {
				toolbar.set_stop_angle();
				touch_angle = Utils.trans_angle(point);
			}
		} else if( udis <= planet.r * 2 ) {
			snow_angle = Utils.trans_angle(point);
		}
		//canvas.onmousemove = null;
		flashReady = false;
   	}

   	function onTouchStart(e){
		e.preventDefault();//forbidden scroll
		point =  {
   			x: e.touches[0].clientX,
   			y: e.touches[0].clientY
	   	};
   	}
};

var imgReady = (function () {
    var list = [], intervalId = null,
 
    // 用来执行队列
    tick = function () {
        var i = 0;
        for (; i < list.length; i++) {
            list[i].end ? list.splice(i--, 1) : list[i]();
        };
        !list.length && stop();
    },
 
    // 停止所有定时器队列
    stop = function () {
        clearInterval(intervalId);
        intervalId = null;
    };
 
    return function (url, ready, key, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();
 
        img.src = url;
        img.id = key;
 
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        };
 
        width = img.width;
        height = img.height;
 
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };
 
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                newWidth * newHeight > 1024
            ) {
                ready.call(img);
                onready.end = true;
            };
        };
        onready();
 
        img.onload = function () {
            !onready.end && onready();
 
            load && load.call(img);
 
            img = img.onload = img.onerror = null;
        };
 
        if (!onready.end) {
            list.push(onready);
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();

function putInResData(num,score){
	$(".score .killnum span").text(num);
	$(".score .getscore span").text(score);
}

function dateOutPut(){
/*
	$(".score .walk span").text(settings.people_slow_rate);
	$(".score .fast span").text(settings.people_fast_rate_max);
	$(".score .slow span").text(settings.people_fast_rate_min);	
	$(".score .snowk span").text(settings.people_snow_speed);
*/
}

function gameResult(){
	//时间到
	clearTimeout(allInterval);
	$("#modal-stupid").fadeIn();
	// $(".result .body .res span").text(all_score);
	// $(".result .body .num span").text(kill_num);
	// $(".result .restart").click(function(){
	// 	window.location.reload();
	// });

	functionsTrigger(all_score, kill_num);
}

function functionsTrigger(score, killnum){
	$("#submit_name").on("click" ,function(){
		var name = $("#userName").val(),
			suggestion = $("#suggestion").val();
		if(!name){
			$("#warning").text("请输入名字");
			$("input").focus(function(){
				$("#warning").text('');
			});
		}else{
			var hexid = generateRandomString(8, true, true);
			var url = "/save"
			var data = {
				id : hexid,
				name : name,
				suggestion : suggestion,
				score : parseInt(score),
				killnum : parseInt(killnum)
			}
			$.post(url, data).success(function(resp){
				if(resp.code == 200){
					$("#form").hide();
					$("#message p").text("提交成功，正在载入排名...");
					$("#message").show();
					var listUrl = "/getSort"
					$.get(listUrl).success(function(resp){
						if(resp.code == 200){
							$("#message").hide();

							var str = "",
								users = resp.data;
							for(var i in users){
								str += "<li><div class='No'>No." + (parseInt(i) + 1) + "</div><div class='nickname'><span class='font'>昵称：</span>" + users[i]['name'] + "</div><div class='point'><span class='font'>得分：</span>" + users[i]['score'] + "</div></li>"
							}
							$("#sort ul").append(str);

							$("#sort").show();

							$("#modal-stupid").css({"height": "500px"})
						}else{
							$("#message p").text(resp.message);
						}
					});
				}
			});
		}
	});
}
