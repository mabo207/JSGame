var Trocco=function(x,y){
	//�ʒu
	this.x=x;
	this.y=y;
	//���x
	this.vx=2;
	this.vy=0;
	//�p�x
	this.angle=0;//�������B���v��肪��
};


var canvas;
var context;
var player;

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
	
	player.x+=player.vx;
	player.y+=player.vy;
	
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	//�g���b�R��p�ӂ���
	player=new Trocco(20,400);
	
	//�Q�[������
	setInterval(ProcessGameloop,33);
};

main();
