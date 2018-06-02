var Trocco=function(x,y){
	//位置
	this.x=x;
	this.y=y;
	//速度
	this.vx=2;
	this.vy=0;
	//角度
	this.angle=0;//横向き。時計回りが正
};


var canvas;
var context;
var player;

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
	
	player.x+=player.vx;
	player.y+=player.vy;
	
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	//トロッコを用意する
	player=new Trocco(20,400);
	
	//ゲーム部分
	setInterval(ProcessGameloop,33);
};

main();
