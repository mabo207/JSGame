const Trocco=class{
	constructor(x,y){
		//�ʒu
		this.x=x;
		this.y=y;
		//���x
		this.maxVx=40;//�ō����x
		this.minVx=4;//�Œᑬ�x
		this.vx=this.minVx;
		this.vy=0;
		//�p�x
		this.angle=0;//�������B�����v��肪��
		//�傫��
		this.width=30;
		this.height=20;
		//�\��x���W(�v���C���[��x���W���Œ肷�邽��)
		this.drawX=30;
		//�̗�
		this.HP=3;
		this.mutekiFrame=0;//���̒l���Ɩ��G��ԁB
	};
};

const Enemy=class{
	constructor(x,y,vx,vy){
		//�ʒu
		this.x=x;
		this.y=y;
		//���x
		this.vx=vx;
		this.vy=vy;
		//�傫��
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

	//�`�揈�����e
	const fillstyle=context.fillStyle;;//�ꎞ�I�ɕ`����@��ێ�����
	//�w�i�̕`��
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
	//�n�ʂ̕`��
	context.beginPath();
	context.fillStyle="#804020";
	context.fillRect(0,groundY+player.height/2,canvas.width,canvas.height-(groundY+player.height/2));
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	//�g���b�R�̕`��
	context.save();
	context.translate(player.drawX,player.y);//��]�̒��S�_��
	context.rotate(player.angle);
	context.translate(-player.drawX,-player.y);//��]�͏I������̂ŕ`��̊�ʒu��߂�
	context.beginPath();
	context.fillStyle="rgba(255,128,0,"+(1-((-player.mutekiFrame)%3)/2).toString(10)+")";
	//context.fillRect(player.x-15,player.y-10,30,20);
	context.fillRect(player.drawX-player.width/2,player.y-player.height/2,player.width,player.height);
	context.fillStyle=fillstyle;
	context.fill();
	context.closePath();
	context.restore();
	//�G�̕`��
	context.fillStyle="#80ffff";
	for(let e of enemy){
		context.beginPath();
		context.arc(player.drawX+e.x-player.x,e.y,e.R,0,Math.PI*2);
		context.fill();
		context.closePath();
	}
	context.fillStyle=fillstyle;
	//UI�̕`��
	//�c��HP
	context.fillStyle="#ffffff";
	context.fillText(player.HP,10,30);
};

const ProcessGameloop=()=>{
	//�`��
	Draw();
	
	//�X�V
	//���@�̍X�V
	if(player.mutekiFrame<0){
		player.mutekiFrame++;//���G���Ԃ̏���
	}
	if(keyinput.acceed){
		//C�������Ă������͉���
		player.vx+=0.1;
		if(player.vx>=player.maxVx-1){
			player.vx=player.maxVx-1;
		}
	}
	if(keyinput.decelerate){
		//Z�������Ă������͌���
		player.vx-=0.4;
		if(player.vx<player.minVx){
			player.vx=player.minVx;
		}
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
	if(player.y>=groundY){
		//���@���n�ʂɐڂ��Ă���Ȃ�@�̂𐅕���
		player.angle=0;
	}else if(player.vy<0){
		//���@���㏸���Ȃ玞�v���ɉ�]
		player.angle-=Math.PI/30;
		if(player.angle<-Math.PI/4){
			player.angle=-Math.PI/4;
		}
	}else if(player.vy>0){
		//���@���㏸���Ȃ甽���v���ɉ�]
		player.angle+=Math.PI/30;
		if(player.angle>Math.PI/4){
			player.angle=Math.PI/4;
		}
	}
	//�G�@�̍X�V
	for(let e of enemy){
		//���x�X�V
		if(e.y>groundY){
			e.vy=-e.vy;
		}
		//�ʒu�X�V
		e.x+=e.vx;
		e.y+=e.vy;
	}
	//�����蔻��E�G�@�̏��O
	for(let i=enemy.length-1;i>=0;i--){
		//�G�@�̏��O���s���̂ŁA�f�N�������g���鎖�Ŕz��O�Q�Ƃ�h��
		const rotatedx=player.x-enemy[i].x;
		const rotatedy=player.y-enemy[i].y;
		//�t��]����悤�ȉ�]�s���������
		const dx=rotatedx*Math.cos(-player.angle)-rotatedy*Math.sin(-player.angle);
		const dy=rotatedx*Math.sin(-player.angle)+rotatedy*Math.cos(-player.angle);
		//�Փ˔���
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
		//���O����
		if(player.drawX+(enemy[i].x-player.x)+enemy[i].R<-10){
			//��ʂ̍��͂���ʂ�߂����珜�O
			enemy.splice(i,1);
		}
	}
	//�G�@�̒ǉ�
	if(enemy.length<100 && player.x-generateEnemyAtPlayerX>600-player.vx*player.vx/5){
		//�G�͓�����100�@�܂ŁB�܂��A600px�ȏ�̊Ԋu���󂯂�(�X�s�[�h���グ��ƊԊu�͋����Ȃ�)�B
		const rand=Math.random();
		const probability=0.1+player.vx*player.vx/3200;//�G�̏o���m��
		if(rand>1.0-probability){
			const maxY=390,minY=130;
			const randY=Math.random()*(maxY-minY)+minY;//�o��y�ʒu
			if(rand<1.0-probability/5){
				//5�@�̂���4�@�̓����_���ȕ����ɐi��
				const maxArg=Math.PI,minArg=Math.PI/3;
				const randArg=Math.random()*(maxArg-minArg)+minArg;//�ˏo�p�x
				enemy.push(new Enemy(player.x+800,randY,player.vx/2*Math.cos(randArg),player.vx/2*Math.sin(randArg)));
			}else{
				//5�@�̂���1�@�͎��@�̂���n�ʂɌ������ĕ������
				let e=new Enemy(player.x+800,randY,-player.vx/2,0);
				e.vy=(groundY-e.y)/(player.x-e.x)*(e.vx-player.vx);
				enemy.push(e);
			}
			generateEnemyAtPlayerX=player.x;//�ł��ŋ߂ɏo���������̃v���C���[�̈ʒu���X�V
		}
	}
};

const main=()=>{
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	context.font="20px '���C���I'";
	keyinput=new KeyInput();
	generateEnemyAtPlayerX=1000;//�ŏ��͂��΂炭�G���łĂ��Ȃ��B
	//�g���b�R��p�ӂ���
	player=new Trocco(0,groundY);
	//�L�[�{�[�h�X�V�n���h���𓮂���
	//document.addEventListener("keydown",keyinput.KeyPress);//���ꂾ��this��document���w���Ă��܂��̂ł���
	//document.addEventListener("keyup",keyinput.KeyRelease);
	document.addEventListener("keydown",KeyPress);
	document.addEventListener("keyup",KeyRelease);
	
	//�Q�[������
	setInterval(ProcessGameloop,1000/60);
};

main();
