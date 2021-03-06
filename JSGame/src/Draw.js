export const draw=(canvas,context,player,enemy,groundY)=>{
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
	context.textAlign="left";
	context.fillStyle="#ffffff";
	context.fillText(player.HP,10,30);
	//進んだ距離
	context.textAlign="right";
	context.fillStyle="#ffffff";
	context.fillText((player.x/10).toFixed(1)+"m",canvas.width-30,30);
};