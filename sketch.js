//Criar variáveis
var trex, trexCorrendo, trexColidiu;
var solo, imagemSolo, soloInvisivel;
var imagemNuvem;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var fimDeJogo, ImgFimDeJogo, reiniciar, imgReiniciar;

//Adicionar efeitos sonoros ao T-Rex
var somJump, somCheckPoint, somFimDeJogo;

//Criar grupos
var grupoObstaculos, grupoNuvens;

//Placar Pontuacção
pontuacao = 0;

//Variáveis para o Estado do Jogo
var JOGAR = 1;
var ENCERRAR = 0
var modoJogo = JOGAR;

// Função para carregar as imagens
function preload(){
  trexCorrendo = loadAnimation("trex1.png","trex2.png","trex3.png");
  trexColidiu = loadImage("trex_collided.png");
  
  imagemSolo = loadImage("ground2.png");
  imagemNuvem = loadImage("cloud2.png");
  
  //Imagens dos obstáculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  ImgFimDeJogo = loadImage("gameOver.png");
  ImgReiniciar = loadImage("restart.png");
  
  //Carregar efeitos sonoros do jogo
  somJump = loadSound("jump.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
  somFimDeJogo = loadSound("die.mp3");
  
  
}

function setup(){
  
  var mensagem = "Isso é uma mensagem";
  
  //Criar ambiente inicial de jogo
  createCanvas(windowWidth, windowHeight);  
  
  //Criar sprite do T-Rex
  trex = createSprite(50,150,20,50);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("trexCollided", trexColidiu);
  
  //Adicionar escala e posição ao Trex
  trex.scale = 0.5;
  trex.x = 50;
  
  //T-Rex Raio de Colisão
  //trex.debug = true;
  //Circulo (tipo,Xoffset,Yoffset,Raio)
  trex.setCollider("circle",0,0,40);
  
  //Criar Sprite do Solo
  solo = createSprite(width/2,height*0.85,width,20);
  solo.addImage("ground",imagemSolo);
  solo.x = solo.width / 2;
  
  //Criar Sprite do Solo Invisível
  soloInvisivel = createSprite(width/2,height*0.9,width,20);
  soloInvisivel.visible = false;
  
  //Criar grupos de obstáculos e nuvens
  grupoObstaculos = new Group();
  grupoNuvens = new Group();
  
  //Criar Icones de Fim de Jogo
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage("fimDeJogo",ImgFimDeJogo);
  fimDeJogo.scale = 0.5;
  fimDeJogo.visible = false;
  
  reiniciar = createSprite(300,140);
  reiniciar.addImage("reiniciar",ImgReiniciar);
  reiniciar.scale = 0.5;
  reiniciar.visible = false;
}

function draw(){
  
  //console.log(frameCount);
  
  //Definir pano de fundo e limpar a tela
  background("white");
  
  //Marcar pontuação do Jogo
  text("Pontuação: " + pontuacao, 500, 50);
  
  //Mostrar o Modo de jogo no Console
  //console.log("Modo de Jogo é: ", modoJogo);
  
  //Modificar estado do jogo
  if(modoJogo === JOGAR){
    // Atribuir velocidade x ao solo
    solo.velocityX =  -(4 + 3*pontuacao/1000);
    
    //Atualizar Placar
    pontuacao = pontuacao + Math.round(frameRate()/60);
    
    //Adicionar efeito Sonoro CheckPoint
    if(pontuacao>0 && pontuacao % 500 === 0){
      somCheckPoint.play();
    }
    
    //Redefinir posição do solo para o centro quando x<0
    if(solo.x < 0){
      solo.x = solo.width / 2;
    }

    //Saltar quando tecla espaço é pressionada
    if(keyDown("space") && trex.y >160) {
      trex.velocityY = -10;
      
      //Adicionar efeito Sonoro T-Rex Salta
      somJump.play();
    }
    
    //Atribuir gravidade para fazer o TRex descer
    trex.velocityY = trex.velocityY + 0.5
    
    //Gerar as nuvens
    gerarNuvens();

    //Gerar obstáculos do solo
    gerarObstaculos();
    
    if(grupoObstaculos.isTouching(trex)){
      modoJogo = ENCERRAR;
      
      //Adicionar efeito Sonoro T-Rex Perde
      somFimDeJogo.play();
    }

  }
  else if(modoJogo === ENCERRAR){
    // Atribuir velocidade x ao solo
    solo.velocityX =  0;
    
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    
    //Alterar Animação T-Rex
    trex.changeAnimation("trexCollided");
    trex.velocityY = 0;
    
    // Definir tempo de vida no modo Encerrar
    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    
    //Visualizar Icones Fim de Jogo e Reiniciar
    fimDeJogo.visible = true;
    reiniciar.visible = true;
    
    // Reiniciar ao clicar no ícone reiniciar
    if(mousePressedOver(reiniciar)){
      
      //Registrar informação no console
      console.log("Reinicair o jogo");
      
      //Reiniciar o jogo
      reset();
      
      //Reiniciar Pontuação
      pontuacao = 0;
      
    }
    
  } 

  
  // Dizer ao trex que ele deve colidir com o chão e ficar
  trex.collide(soloInvisivel);
  
  //Desenhar Sprites
  drawSprites();
  
  //Mostrar Posição X e Y do mouse
  text("("+mouseX+";"+mouseY+")",mouseX-10,mouseY-10);
}

function gerarNuvens(){
  //Escrever aqui o código para gerar as nuvens
  if(frameCount % 60 === 0){
    var nuvem = createSprite(600,100,40,10);
    nuvem.velocityX = -3;
    
    //Adicionar imagem da nuvem nos sprites
    nuvem.addImage(imagemNuvem);
    nuvem.scale = Math.round(random(3,6))/10;
    //console.log(nuvem.scale);
    
    //Tornar posição Y da nuvem aleatória
    nuvem.y = Math.round(random(10,100));
    
    //Garantir que profundidade da nuvem seja maior que a do T-Rex
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    //console.log(nuvem.depth);
    //console.log(trex.depth);
    
    //Atrubuir tempo de duração da variável
    //Vida = Distância x velocidade
    nuvem.lifetime = 200;
    
    //Adicionar cada elemento nuvem criado ao grupo
    grupoNuvens.add(nuvem);
    
  } 
}

function gerarObstaculos(){
  if(frameCount % 60 === 0){
    var obstaculo = createSprite(600,165,10,40);
    
    //Atribuir velocidade ao obstáculo
    obstaculo.velocityX = -(5 + pontuacao/1000);
    
    //Criar Obstáculos aleatórios
    var rand = Math.round(random(1,6));
    
    switch(rand){
        case 1: obstaculo.addImage(obstaculo1);
                break;
        case 2: obstaculo.addImage(obstaculo2);
                break;
        case 3: obstaculo.addImage(obstaculo3);
                break;
        case 4: obstaculo.addImage(obstaculo4);
                break;
        case 5: obstaculo.addImage(obstaculo5);
                break;
        case 6: obstaculo.addImage(obstaculo6);
                break;
                default: break;
    }
    
    // Alterar escala e vida útil
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    
    //Adicionar cada elemento de obstáculo criado ao grupo
    grupoObstaculos.add(obstaculo);
  }
  
}

function reset(){

  //Mudar modo de jogo para Jogar
  modoJogo = JOGAR;
  
  //Tornar icones "Fim de Jogo" e "Reiniciar" invisíveis
  fimDeJogo.visible = false;
  reiniciar.visible = false;  
  
  //Destruir todos os obstáculos e nuvens ao reiniciar
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  
  // Modificar animação de T-Rex Collided para T-Rex Corredor
  trex.changeAnimation("correndo");
  
}