const Trocco=class{
	constructor(x,y){
		//�ʒu
		this.x=x;
		this.y=y;
		//���x
		this.vx=2;
		this.vy=0;
		//�p�x
		this.angle=0;//�������B���v��肪��
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
	//�`��
	context.clearRect(0,0,canvas.width,canvas.height);

	//�`�揈�����e
	var fillstyle;//�ꎞ�I�ɕ`����@��ێ�����
	fillstyle=context.fillStyle;
	//�w�i�̕`��
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
	//�n�ʂ̕`��
	context.beginPath();
	context.fillStyle="#804020";
	context.fillRect(0,410,canvas.width,canvas.height-410);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	//�g���b�R�̕`��
	context.beginPath();
	context.fillStyle="#FF8000";
	//context.fillRect(player.x-15,player.y-10,30,20);
	context.fillRect(30,player.y-10,30,20);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	
	//�X�V
	if(keyinput.acceed){
		//C�������Ă������͉���
		player.vx+=0.1;
	}
	if(keyinput.decelerate){
		//Z�������Ă������͌���
		player.vx-=0.4;
	}
	if(keyinput.jump && player.y==groundY){
		//�v���C���[���n�ʂɂ��āAX�������ƃW�����v
		player.vy=-10;
	}
	player.vy+=9.8/20;//�d�͉����x
	player.x+=player.vx;
	player.y+=player.vy;
	if(player.y>groundY){
		//�n�ʂƂ̓����蔻��
		player.y=groundY;
		player.vy=0;
	}
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	keyinput=new KeyInput();
	//�g���b�R��p�ӂ���
	player=new Trocco(20,groundY);
	//�L�[�{�[�h�X�V�n���h���𓮂���
	//document.addEventListener("keydown",keyinput.KeyPress);//���ꂾ��this��document���w���Ă��܂��̂ł���
	//document.addEventListener("keyup",keyinput.KeyRelease);
	document.addEventListener("keydown",KeyPress);
	document.addEventListener("keyup",KeyRelease);
	
	//�Q�[������
	setInterval(ProcessGameloop,1000/60);
};

main();
