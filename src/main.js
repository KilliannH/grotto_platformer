const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300}, // will affect our player sprite
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
let spacebar;
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

    this.physics.world.bounds.width = lvl1.widthInPixels;
    this.physics.world.bounds.height = lvl1.heightInPixels;

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = lvl1.addTilesetImage('grotto', 'tiles');

    let bgLayer = lvl1.createStaticLayer('background', tileset, 0, 0);

    // Set up the layer to have matter bodies. Any colliding tiles will be given a Matter body.
    bgLayer.setCollisionByProperty({ collides: true });

    // create the player sprite
    player = this.physics.add.sprite(20, 120, 'player');

    player.body.setGravityY(300);

    player.setBounce(0.1); // our player will bounce from items

    player.setCollideWorldBounds(true); // don't go out of the map

    this.physics.add.collider(player, bgLayer);

    this.anims.create({
        key: 'idle',
        frames: [ { key: 'player', frame: 5 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: [ {key: 'player', frame: 4} ],
        frameRate: 20
    });

    // Phaser supports multiple cameras, but you can access the default camera like this:
    this.cameras.main.setBounds(0, 0, lvl1.widthInPixels, lvl1.heightInPixels);
    this.cameras.main.setZoom(4);
    // make the camera follow the player
    this.cameras.main.startFollow(player);



    // Set up the arrows to control the camera
    cursors = this.input.keyboard.createCursorKeys();
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update(time, delta) {

    console.log(player.body.onFloor());
    // Apply the controls to the camera each update tick of the game
    // controls.update(delta);

    if (cursors.left.isDown) {
        player.setVelocityX(-100);
        player.anims.play('right', true);
        player.flipX = true;
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(100);

        player.anims.play(('right'), true);
        player.flipX = false;
    }
    else {
        player.setVelocityX(0);

        player.anims.play('idle');
    }

    if (spacebar.isDown && player.body.onFloor())
    {
        player.setVelocityY(-200);

        player.anims.play('jump');
    }
}