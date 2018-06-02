const Trocco=class{
	constructor(x,y){
		//位置
		this.x=x;
		this.y=y;
		//速度
		this.vx=2;
		this.vy=0;
		//角度
		this.angle=0;//横向き。時計回りが正
	};
};

const KeyInput=class{
	constructor(){
		this.acceed=false;
		this.decelerate=false;
		this.jump=false;
	};
};

var canvas;
var context;
var keyinput;
var player;
const groundY=400;

const KeyPress=(e)=>{
	switch(e.keyCode){
	case 90://z
		keyinput.decelerate=true;
		break;
	case 88://x
		keyinput.jump=true;
		break;
	case 67://c
		keyinput.acceed=true;
		break;
	}
};
KeyRelease=(e)=>{
	switch(e.keyCode){
	case 90://z
		keyinput.decelerate=false;
		break;
	case 88://x
		keyinput.jump=false;
		break;
	case 67://c
		keyinput.acceed=false;
		break;
	}
}


const ProcessGameloop=()=>{
	//描画
	context.clearRect(0,0,canvas.width,canvas.height);

	//描画処理内容
	var fillstyle;//一時的に描画方法を保持する
	fillstyle=context.fillStyle;
	//背景の描画
	context.beginPath();
	context.fillStyle="#202010";
	context.fillRect(0,0,canvas.width,canvas.height);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	const lightmergin=80;
	const circleR=5;
	context.fillStyle="#ffff80";
	for(let i=0;i*lightmergin-circleR<canvas.width;i++){
		context.beginPath();
		context.arc(i*lightmergin-player.x%lightmergin,100,circleR,0,Math.PI*2);
		context.fill();
		context.closePath();
	}
	context.fillStyle=fillstyle;
	//地面の描画
	context.beginPath();
	context.fillStyle="#804020";
	context.fillRect(0,410,canvas.width,canvas.height-410);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	//トロッコの描画
	context.beginPath();
	context.fillStyle="#FF8000";
	//context.fillRect(player.x-15,player.y-10,30,20);
	context.fillRect(30,player.y-10,30,20);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	
	//更新
	if(keyinput.acceed){
		//Cを押していた時は加速
		player.vx+=0.1;
	}
	if(keyinput.decelerate){
		//Zを押していた時は減速
		player.vx-=0.4;
	}
	if(keyinput.jump && player.y==groundY){
		//プレイヤーが地面にいて、Xを押すとジャンプ
		player.vy=-10;
	}
	player.vy+=9.8/20;//重力加速度
	player.x+=player.vx;
	player.y+=player.vy;
	if(player.y>groundY){
		//地面との当たり判定
		player.y=groundY;
		player.vy=0;
	}
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	keyinput=new KeyInput();
	//トロッコを用意する
	player=new Trocco(20,groundY);
	//キーボード更新ハンドラを動かす
	//document.addEventListener("keydown",keyinput.KeyPress);//これだとthisがdocumentを指してしまうのでだめ
	//document.addEventListener("keyup",keyinput.KeyRelease);
	document.addEventListener("keydown",KeyPress);
	document.addEventListener("keyup",KeyRelease);
	
	//ゲーム部分
	setInterval(ProcessGameloop,1000/60);
};

main();
