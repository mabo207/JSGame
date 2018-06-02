const Trocco=class{
	constructor(x,y){
		//位置
		this.x=x;
		this.y=y;
		//速度
		this.maxVx=40;//最高速度
		this.minVx=4;//最低速度
		this.vx=this.minVx;
		this.vy=0;
		//角度
		this.angle=0;//横向き。反時計回りが正
		//大きさ
		this.width=30;
		this.height=20;
		//表示x座標(プレイヤーのx座標を固定するため)
		this.drawX=30;
		//体力
		this.HP=3;
		this.mutekiFrame=0;//負の値だと無敵状態。
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
let generateEnemyAtPlayerX;

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
	const lightmergin=player.maxVx*2;
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
	context.save();
	context.translate(player.drawX,player.y);//回転の中心点へ
	context.rotate(player.angle);
	context.translate(-player.drawX,-player.y);//回転は終わったので描画の基準位置を戻す
	context.beginPath();
	context.fillStyle="rgba(255,128,0,"+(1-((-player.mutekiFrame)%3)/2).toString(10)+")";
	//context.fillRect(player.x-15,player.y-10,30,20);
	context.fillRect(player.drawX-player.width/2,player.y-player.height/2,player.width,player.height);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	context.restore();
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
	if(player.mutekiFrame<0){
		player.mutekiFrame++;//無敵時間の消費
	}
	if(keyinput.acceed){
		//Cを押していた時は加速
		player.vx+=0.1;
		if(player.vx>=player.maxVx-1){
			player.vx=player.maxVx-1;
		}
	}
	if(keyinput.decelerate){
		//Zを押していた時は減速
		player.vx-=0.4;
		if(player.vx<player.minVx){
			player.vx=player.minVx;
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
	if(player.y>=groundY){
		//自機が地面に接しているなら機体を水平に
		player.angle=0;
	}else if(player.vy<0){
		//自機が上昇中なら時計回りに回転
		player.angle-=Math.PI/30;
		if(player.angle<-Math.PI/4){
			player.angle=-Math.PI/4;
		}
	}else if(player.vy>0){
		//自機が上昇中なら反時計回りに回転
		player.angle+=Math.PI/30;
		if(player.angle>Math.PI/4){
			player.angle=Math.PI/4;
		}
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
		const rotatedx=player.x-enemy[i].x;
		const rotatedy=player.y-enemy[i].y;
		//逆回転するような回転行列をかける
		const dx=rotatedx*Math.cos(-player.angle)-rotatedy*Math.sin(-player.angle);
		const dy=rotatedx*Math.sin(-player.angle)+rotatedy*Math.cos(-player.angle);
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
		}
		//除外判定
		if(player.drawX+(enemy[i].x-player.x)+enemy[i].R<-10){
			//画面の左はじを通り過ぎたら除外
			enemy.splice(i,1);
		}
	}
	//敵機の追加
	if(enemy.length<100 && player.x-generateEnemyAtPlayerX>600-player.vx*player.vx/5){
		//敵は同時に100機まで。また、600px以上の間隔を空ける(スピードを上げると間隔は狭くなる)。
		const rand=Math.random();
		const probability=0.1+player.vx*player.vx/3200;//敵の出現確率
		if(rand>1.0-probability){
			const maxY=390,minY=130;
			const randY=Math.random()*(maxY-minY)+minY;//出現y位置
			if(rand<1.0-probability/5){
				//5機のうち4機はランダムな方向に進む
				const maxArg=Math.PI,minArg=Math.PI/3;
				const randArg=Math.random()*(maxArg-minArg)+minArg;//射出角度
				enemy.push(new Enemy(player.x+800,randY,player.vx/2*Math.cos(randArg),player.vx/2*Math.sin(randArg)));
			}else{
				//5機のうち1機は自機のいる地面に向かって放たれる
				let e=new Enemy(player.x+800,randY,-player.vx/2,0);
				e.vy=(groundY-e.y)/(player.x-e.x)*(e.vx-player.vx);
				enemy.push(e);
			}
			generateEnemyAtPlayerX=player.x;//最も最近に出現した時のプレイヤーの位置を更新
		}
	}
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	context.font="20px 'メイリオ'";
	keyinput=new KeyInput();
	generateEnemyAtPlayerX=1000;//最初はしばらく敵がでてこない。
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
