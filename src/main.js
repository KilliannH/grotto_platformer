const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500}, // will affect our player sprite
            debug: false // change if you need
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let controls;
let groundLayer, coinLayer;
let text;

function preload() {
    this.load.image('tiles', '../lib/grotto_escape_pack/graphics/tiles.png');
    this.load.tilemapTiledJSON('lvl1', '../assets/tilemaps/lvl1.json');

    this.load.spritesheet('player',
        './lib/grotto_escape_pack/graphics/player.png',
        { frameWidth: 16, frameHeight: 16 }
    );
}

function create() {
    const lvl1 = this.make.tilemap({key: 'lvl1'});

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = lvl1.addTilesetImage('grotto', 'tiles');

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const layer = lvl1.createStaticLayer('background', tileset, 0, 0);

    // create the player sprite
    player = this.physics.add.sprite(16, 16, 'player');

    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 10,
        reverse: true,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [ { key: 'player', frame: 3 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    // Phaser supports multiple cameras, but you can access the default camera like this:
    /*const camera = this.cameras.main;
    camera.setZoom(4);
    camera.setBounds(0, 0, 512, 160);*/



    // Set up the arrows to control the camera
    cursors = this.input.keyboard.createCursorKeys();
    /*controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: camera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    });*/
}

function update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    // controls.update(delta);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('idle');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}