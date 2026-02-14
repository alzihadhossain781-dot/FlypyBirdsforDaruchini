let config = {
    type: Phaser.AUTO,
    width: 360,       // Portrait width
    height: 640,      // Portrait height
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 800 } }
    },
    scene: { preload: preload, create: create, update: update },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

let game = new Phaser.Game(config);

let bird, pillars, score = 0, scoreText;
let bgm, tapSound, gameOverSound;
let gameOver = false, restartButton;

function preload() {
    // Images
    this.load.image('bird', 'assets/bird.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('pillar', 'assets/pillar.png');
    this.load.image('scoreboard', 'assets/scoreboard.png');
    this.load.image('restart', 'assets/restart.png');

    // Audio
    this.load.audio('bgm', 'assets/bgm.mp3');
    this.load.audio('gameover', 'assets/gameover.wav');
    this.load.audio('tap', 'assets/tap.wav');
}

function create() {
    // Background
    this.add.image(180, 320, 'background').setScale(1.2);

    // Bird
    bird = this.physics.add.sprite(100, 320, 'bird').setScale(0.5);
    bird.setCollideWorldBounds(true);

    // Pillars
    pillars = this.physics.add.group();
    addPillars(this);

    // Score
    scoreText = this.add.text(20, 20, 'Score: 0', { font: '24px Arial', fill: '#fff' });

    // Sounds
    bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
    tapSound = this.sound.add('tap', { volume: 0.5 });
    gameOverSound = this.sound.add('gameover', { volume: 0.7 });
    bgm.play();

    // Input
    this.input.on('pointerdown', () => {
        if(!gameOver){
            bird.setVelocityY(-350);
            tapSound.play();
        }
    });
}

function update() {
    if(gameOver) return;

    pillars.getChildren().forEach(function(pillar){
        pillar.x -= 2; // constant horizontal speed

        if(pillar.x \u003C -50){
            pillar.x = 360 + 50;  // reset x
            // medium gap
            pillar.y = Phaser.Math.Between(180, 460); 
            score += 1;
            scoreText.setText('Score: ' + score);
        }
    });

    // Collision
    this.physics.world.collide(bird, pillars, hitPillar, null, this);
}

function addPillars(scene){
    // 2 pillars (top & bottom) with medium gap
    let gap = 150; // medium gap
    for(let i=0; i\u003C3; i++){
        let y = Phaser.Math.Between(180, 460);  // top pillar center
        let topPillar = scene.physics.add.sprite(360 + i\\*200, y - gap/2 - 160, 'pillar'); // top
        topPillar.setImmovable(true);
        let bottomPillar = scene.physics.add.sprite(360 + i\\*200, y + gap/2 + 160, 'pillar'); // bottom
        bottomPillar.setImmovable(true);
        pillars.add(topPillar);
        pillars.add(bottomPillar);
    }
}

function hitPillar(){
    if(gameOver) return;

    gameOver = true;
    bird.setTint(0xff0000);
    bird.setVelocity(0,0);

    bgm.stop();
    gameOverSound.play();

    let scoreboard = game.scene.scenes\\[0\\].add.image(180, 320, 'scoreboard').setScale(1);
    restartButton = game.scene.scenes\\[0\\].add.image(180, 400, 'restart').setInteractive();

    restartButton.on('pointerdown', () => {
        location.reload();
    });
}