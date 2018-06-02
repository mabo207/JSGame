const Trocco=class{
	constructor(x,y){
		//�ʒu
		this.x=x;
		this.y=y;
		//���x
		this.vx=0;
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
	context.beginPath();

	//�`�揈�����e
	var fillstyle;//�ꎞ�I�ɕ`����@��ێ�����
	//�g���b�R�̕`��
	fillstyle=context.fillStyle;
	context.fillStyle="#FF8000";
	context.fillRect(player.x-15,player.y-10,30,20);
	context.fillStyle=fillstyle;
	
	context.fill();
	context.closePath();
	//�X�V
	console.log(keyinput.jump);
	if(keyinput.acceed==true){
		//C�������Ă������͉���
		player.vx++;
	}
	if(keyinput.decelerate==true){
		//Z�������Ă������͌���
		player.vx--;
	}
	if(keyinput.jump==true){
		//X�������ƃW�����v
		player.vy+=-10;
	}
	player.x+=player.vx;
	player.y+=player.vy;
	
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	keyinput=new KeyInput();
	//�g���b�R��p�ӂ���
	player=new Trocco(20,400);
	//�L�[�{�[�h�X�V�n���h���𓮂���
	//document.addEventListener("keydown",keyinput.KeyPress);//���ꂾ��this��document���w���Ă��܂��̂ł���
	//document.addEventListener("keyup",keyinput.KeyRelease);
	document.addEventListener("keydown",KeyPress);
	document.addEventListener("keyup",KeyRelease);
	
	//�Q�[������
	setInterval(ProcessGameloop,33);
};

main();
