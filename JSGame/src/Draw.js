export const draw=(canvas,context,player,enemy,groundY)=>{
	context.clearRect(0,0,canvas.width,canvas.height);

	//•`‰æˆ—“à—e
	const fillstyle=context.fillStyle;;//ˆê“I‚É•`‰æ•û–@‚ğ•Û‚·‚é
	//”wŒi‚Ì•`‰æ
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
	//’n–Ê‚Ì•`‰æ
	context.beginPath();
	context.fillStyle="#804020";
	context.fillRect(0,groundY+player.height/2,canvas.width,canvas.height-(groundY+player.height/2));
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	//ƒgƒƒbƒR‚Ì•`‰æ
	context.save();
	context.translate(player.drawX,player.y);//‰ñ“]‚Ì’†S“_‚Ö
	context.rotate(player.angle);
	context.translate(-player.drawX,-player.y);//‰ñ“]‚ÍI‚í‚Á‚½‚Ì‚Å•`‰æ‚ÌŠî€ˆÊ’u‚ğ–ß‚·
	context.beginPath();
	context.fillStyle="rgba(255,128,0,"+(1-((-player.mutekiFrame)%3)/2).toString(10)+")";
	//context.fillRect(player.x-15,player.y-10,30,20);
	context.fillRect(player.drawX-player.width/2,player.y-player.height/2,player.width,player.height);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	context.restore();
	//“G‚Ì•`‰æ
	context.fillStyle="#80ffff";
	for(let e of enemy){
		context.beginPath();
		context.arc(player.drawX+e.x-player.x,e.y,e.R,0,Math.PI*2);
		context.fill();
		context.closePath();
	}
	context.fillStyle=fillstyle;
	//UI‚Ì•`‰æ
	//c‚èHP
	context.textAlign="left";
	context.fillStyle="#ffffff";
	context.fillText(player.HP,10,30);
	//i‚ñ‚¾‹——£
	context.textAlign="right";
	context.fillStyle="#ffffff";
	context.fillText((player.x/10).toFixed(1)+"m",canvas.width-30,30);
};