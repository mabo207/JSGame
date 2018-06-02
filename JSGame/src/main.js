const Trocco=class{
	constructor(x,y){
		//位置
		this.x=x;
		this.y=y;
		//速度
		this.vx=0;
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
	context.beginPath();

	//描画処理内容
	var fillstyle;//一時的に描画方法を保持する
	//トロッコの描画
	fillstyle=context.fillStyle;
	context.fillStyle="#FF8000";
	context.fillRect(player.x-15,player.y-10,30,20);
	context.fillStyle=fillstyle;
	
	context.fill();
	context.closePath();
	//更新
	console.log(keyinput.jump);
	if(keyinput.acceed==true){
		//Cを押していた時は加速
		player.vx++;
	}
	if(keyinput.decelerate==true){
		//Zを押していた時は減速
		player.vx--;
	}
	if(keyinput.jump==true){
		//Xを押すとジャンプ
		player.vy+=-10;
	}
	player.x+=player.vx;
	player.y+=player.vy;
	
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	keyinput=new KeyInput();
	//トロッコを用意する
	player=new Trocco(20,400);
	//キーボード更新ハンドラを動かす
	//document.addEventListener("keydown",keyinput.KeyPress);//これだとthisがdocumentを指してしまうのでだめ
	//document.addEventListener("keyup",keyinput.KeyRelease);
	document.addEventListener("keydown",KeyPress);
	document.addEventListener("keyup",KeyRelease);
	
	//ゲーム部分
	setInterval(ProcessGameloop,33);
};

main();
