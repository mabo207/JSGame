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
		//大きさ
		this.width=30;
		this.height=20;
		//表示x座標(プレイヤーのx座標を固定するため)
		this.drawX=30;
		//体力
		this.HP=3;
		this.mutekiFrame=0;//負の値だと無敵状態
	};
};

const Enemy=class{
	constructor(x,y,vx,vy){
		//位置
		this.x=x;
		this.y=y;
		//速度
		this.vx=vx;
		this.vy=vy;
		//大きさ
		this.R=10;
	};
};

const KeyInput=class{
	constructor(){
		this.acceed=false;
		this.decelerate=false;
		this.jump=false;
	};
};

let canvas;
let context;
let keyinput;
let player;
const groundY=400;
let enemy=[];

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

const Draw=()=>{
	context.clearRect(0,0,canvas.width,canvas.height);

	//描画処理内容
	const fillstyle=context.fillStyle;;//一時的に描画方法を保持する
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
	context.fillRect(0,groundY+player.height/2,canvas.width,canvas.height-(groundY+player.height/2));
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	//トロッコの描画
	context.beginPath();
	//context.fillStyle="#FF8000";
	context.fillStyle="rgba(255,128,0,"+(1-((-player.mutekiFrame)%3)/2).toString(10)+")";
	//context.fillRect(player.x-15,player.y-10,30,20);
	context.fillRect(player.drawX-player.width/2,player.y-player.height/2,player.width,player.height);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	//敵の描画
	context.fillStyle="#80ffff";
	for(let e of enemy){
		context.beginPath();
		context.arc(player.drawX+e.x-player.x,e.y,e.R,0,Math.PI*2);
		context.fill();
		context.closePath();
	}
	context.fillStyle=fillstyle;
	//UIの描画
	//残りHP
	context.fillStyle="#ffffff";
	context.fillText(player.HP,10,30);
};

const ProcessGameloop=()=>{
	//描画
	Draw();
	
	//更新
	//自機の更新
	if(keyinput.acceed){
		//Cを押していた時は加速
		player.vx+=0.1;
	}
	if(keyinput.decelerate){
		//Zを押していた時は減速
		player.vx-=0.4;
		if(player.vx<0.1){
			player.vx=0.1;
		}
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
	//敵機の更新
	for(let e of enemy){
		//速度更新
		if(e.y>groundY){
			e.vy=-e.vy;
		}
		//位置更新
		e.x+=e.vx;
		e.y+=e.vy;
	}
	//当たり判定・敵機の除外
	for(let i=enemy.length-1;i>=0;i--){
		//敵機の除外を行うので、デクリメントする事で配列外参照を防ぐ
		const dx=player.x-enemy[i].x;
		const dy=player.y-enemy[i].y;
		//衝突判定
		if(player.mutekiFrame==0){
			if(
				(dx<-player.width/2 && dx+enemy[i].R>=-player.width/2 && ((dy>=-player.height/2 && dy<=player.height/2) || (dy<-player.height/2 && (dy+player.height/2)*(dy+player.height/2)+(dx+player.height/2)*(dx+player.height/2)<=enemy.R*enemy.R) || (dy<-player.height/2 && (dy-player.height/2)*(dy-player.height/2)+(dx+player.height/2)*(dx+player.height/2)<=enemy.R*enemy.R)))
				|| (dx>=-player.width/2 && dx<=player.width/2 && dy+enemy[i].R>-player.height/2 && dy-enemy[i].R<player.height/2)
				|| (dx>player.width/2 && dx-enemy[i].R<=player.width/2 && ((dy>=-player.height/2 && dy<=player.height/2) || (dy<-player.height/2 && (dy+player.height/2)*(dy+player.height/2)+(dx-player.height/2)*(dx-player.height/2)<=enemy.R*enemy.R) || (dy<-player.height/2 && (dy-player.height/2)*(dy-player.height/2)+(dx-player.height/2)*(dx-player.height/2)<=enemy.R*enemy.R)))
			){
				player.HP--;
				player.mutekiFrame=-60;
			}
		}else{
			player.mutekiFrame++;//無敵時間の消費
		}
		//除外判定
		if(player.drawX+(enemy[i].x-player.x)+enemy[i].R<-10){
			//画面の左はじを通り過ぎたら除外
			enemy.splice(i,1);
		}
	}
	//敵機の追加
	if(enemy.length==0){
		enemy.push(new Enemy(player.x+800,390,-3,1));
	}
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	context.font="20px 'メイリオ'";
	keyinput=new KeyInput();
	//トロッコを用意する
	player=new Trocco(0,groundY);
	//キーボード更新ハンドラを動かす
	//document.addEventListener("keydown",keyinput.KeyPress);//これだとthisがdocumentを指してしまうのでだめ
	//document.addEventListener("keyup",keyinput.KeyRelease);
	document.addEventListener("keydown",KeyPress);
	document.addEventListener("keyup",KeyRelease);
	
	//ゲーム部分
	setInterval(ProcessGameloop,1000/60);
};

main();
