const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }, // No gravity
        debug: false,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
    parent: "game-container",
  };
  
  let basket;
  let apples;
  let score = 0;
  let scoreText;
  let cursors;
  let wasd;
  let winText;
  
  const game = new Phaser.Game(config);
  
  function preload() {
    this.load.image("basket", "/basket.png"); // Replace with your basket image path
    this.load.image("apple", "/apple.png"); // Replace with your apple image path
    this.load.audio("collect", "/collect-5930.mp3"); // Replace with your collect sound path
  }
  
  function create() {
    // Create the basket and scale it down
    basket = this.physics.add.image(400, 500, "basket").setScale(0.2); // Reduce size by 50%
    basket.setCollideWorldBounds(true); // Prevent the basket from going out of bounds
    basket.setPosition(100, 500); // Start position for the basket
  
    // Create a group of apples and scale them down
    apples = this.physics.add.group({
      key: "apple",
      repeat: 9, // Total 10 apples (1 + 9)
      setXY: { x: 20, y: 0, stepX: 70 },
    });
  
    // Position apples randomly on the screen and scale them down
    apples.children.iterate(function (child) {
      child.setX(Phaser.Math.Between(50, 750));
      child.setY(Phaser.Math.Between(50, 550));
      child.setScale(0.1); // Reduce size by 70%
    });
  
    // Add collision detection between basket and apples
    this.physics.add.overlap(basket, apples, collectApple, null, this);
  
    // Set up keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  
    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
    });
  
    // Create a hidden "You Win" text element
    winText = this.add.text(400, 300, "You Win!", {
      fontSize: "64px",
      fill: "#fff",
    });
    winText.setOrigin(0.5);
    winText.setVisible(false); // Initially hidden
  }
  
  function update() {
    // Control basket movement
    if (wasd.left.isDown) {
      basket.setVelocityX(-160);
    } else if (wasd.right.isDown) {
      basket.setVelocityX(160);
    } else {
      basket.setVelocityX(0);
    }
  
    if (wasd.up.isDown) {
      basket.setVelocityY(-160);
    } else if (wasd.down.isDown) {
      basket.setVelocityY(160);
    } else {
      basket.setVelocityY(0);
    }
  }
  
  function collectApple(basket, apple) {
    // Play sound on apple collection
    this.sound.play("collect");
  
    // Remove the apple from the scene
    apple.disableBody(true, true);
  
    // Update score
    score += 10;
    scoreText.setText("Score: " + score);
  
    // Check if score has reached 100
    if (score >= 100) {
      winText.setVisible(true); // Show "You Win" text
      this.physics.pause(); // Pause the game
      basket.setTint(0x00ff00); // Optional: Change basket color to indicate victory
    }
  }
  