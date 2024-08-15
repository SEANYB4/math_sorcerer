const canvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext('2d');


class Game {


    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.player = new Player(100, 300, this);
        this.wizard = new Wizard(300, 300, this);
        this.width = this.canvas.width;

        this.enemies = [];
        this.enemies.push(new Skeleton(500, 400, this));


        // FRAMERATE
        this.fps = 15;
        this.frameDuration = 1000/this.fps;
        this.last = new Date();


        this.attacks = [];


        this.gameover = false;


        // IMAGES

        this.wizardIdleImage = new Image();
        this.wizardIdleImage.src = './Images/Fire vizard/Idle.png';

        this.skeletonWarriorImage = new Image();
        this.skeletonWarriorImage.src = './Images/Skeleton_Warrior/Idle.png';


        this.skeletonWarriorImageLeft = new Image();
        this.skeletonWarriorImageLeft.src = 'Images/Skeleton_Warrior/IdleLeft.png';


        this.skeletonAttackImage = new Image();
        this.skeletonAttackImage.src = './Images/Skeleton_Warrior/Attack_1.png';


        this.skeletonAttackImageLeft = new Image();
        this.skeletonAttackImageLeft.src = 'Images/Skeleton_Warrior/Attack_1Left.png';




        this.sorcererIdleImage = new Image();
        this.sorcererIdleImage.src = './Images/Wanderer Magican/Idle.png';

        this.wizardIdleLeftImage = new Image();
        this.wizardIdleLeftImage.src = 'Images/Fire vizard/IdleLeft.png';



        this.wizardRunningImage = new Image();
        this.wizardRunningImage.src = 'Images/Fire vizard/Run.png';


        this.wizardRunningImageLeft = new Image();
        this.wizardRunningImageLeft.src = 'Images/Fire vizard/RunLeft.png';


        this.backgroundImage = new Image();
        this.backgroundImage.src = './Images/Backgrounds/background1.jpg';


        // EVENT LISTENING

        document.addEventListener('keydown', (event) => {

            switch(event.key) {


                case 'a':
                    this.player.x -= this.player.speed;
                    this.player.direction = 'left';
                    this.player.running = true;
                    break;
                case 'd':
                    this.player.x += this.player.speed;
                    this.player.direction = 'right';
                    this.player.running = true;
                    break;
                case 'w':
                    this.player.y -= this.player.speed;
                    this.player.running = true;
                    break;
                case 's':
                    this.player.y += this.player.speed;
                    this.player.running = true;
                    break;
                case 'f':
                    this.player.attack();
            }


        });

        document.addEventListener('keyup', (event) => {

            switch(event.key) {


                case 'a':
                    this.player.running = false;
                    break;
                case 'd':
                    this.player.running = false;
                    break;
                case 'w':
                    this.player.running = false;
                    break;
                case 's':
                    this.player.running = false;
                    break;
                
            }


        });


        

        
    }

    drawHealthBar() {

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(20, 20, this.player.health, 50);
    }


    update() {

        // FRAMERATE

        let now = new Date();
        

        if ((now - this.last) >= this.frameDuration && !this.gameover) {
            this.last = now;

            
            // ENEMY CONTROLLER

            if (this.enemies.length < 5) {
                this.enemies.push(new Skeleton(Math.random() * this.canvas.width, Math.random()*this.canvas.height + this.canvas.height/2, this));
            }






            // COLLISION DETECTION

            // Player/wall collision detection

            if (this.player.x > this.canvas.width-this.player.size) {
                this.player.x = this.canvas.width-this.player.size;
            } else if (this.player.x < 0) {
                this.player.x = 0;
            } else if(this.player.y < 0) {
                this.player.y = 0;
            } else if (this.player.y > this.canvas.height - this.player.size) {
                this.player.y = this.canvas.height - this.player.size;
            }


            // Player/wizard collision detection

            if (Math.abs(this.player.x - this.wizard.x) < this.player.size) {
                if (Math.abs(this.player.y - this.wizard.y) < this.wizard.size) {
                    this.player.x = this.wizard.x - this.wizard.size;
                }
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);



            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

            
            this.player.draw();
            this.player.update();
            this.wizard.draw();
            this.wizard.update();



            // Draw enemies

            for (let i = 0; i < this.enemies.length; i++) {

                this.enemies[i].draw();
                this.enemies[i].update();
            }

            // Draw attacks

            this.attacks.forEach(attack => {
                
                
                attack.draw();
                
                attack.update();

            });

            

        }

        if (this.gameover) {
            console.log("GAME OVER");
        }


        this.drawHealthBar();
        
        requestAnimationFrame(this.update.bind(this));

    }
}

class Player {


    constructor(x, y, game) {


        this.x = x;
        this.y = y;
        this.game = game;
        this.size = 50;
        this.speed = 5;
        this.currentFrame = 0;
        this.frameWidth = 128;
        this.spriteWidth = 50;
        this.spriteHeight = 70;
        this.health = 100;
        this.image = this.game.wizardIdleImage;
        this.direction = 'right';


    }

    draw() {


        let imageToDraw;

        if (this.direction == 'left') {

            imageToDraw = this.game.wizardIdleLeftImage;
        } else {
            imageToDraw = this.game.wizardIdleImage;
        }


        if (this.running && this.direction == 'left') {

            imageToDraw = this.game.wizardRunningImageLeft;

        } else if (this.running && this.direction == 'right') {
            imageToDraw = this.game.wizardRunningImage;
        }


        this.game.ctx.drawImage(
            imageToDraw,
            this.currentFrame * this.frameWidth,
            0, 
            this.spriteWidth,
            this.spriteHeight, 
            this.x, 
            this.y,
            this.spriteWidth,
            this.spriteHeight

        )

        
    }


    update() {


        if (this.currentFrame < 6) {
            this.currentFrame += 1;
        } else {
            this.currentFrame = 1;
        }
    }


    attack() {

        

        this.game.attacks.push(new IceBall(this.game, this.direction));
        
    }
}




class IceBall {

    constructor(game, direction) {
        this.game = game;
        this.x = game.player.x;
        this.y = game.player.y;
        this.direction = direction;
        

    }

    draw() {

        this.game.ctx.fillStyle = 'blue';
        this.game.ctx.fillRect(this.x, this.y, 5, 5);
    }


    update() {

        if (this.direction == 'left') {
            this.x -= 20;

        } else {
            this.x += 20;
        }
        
        let currentX = this.x;
        let currentY = this.y;
        if (this.x > this.game.width || this.x < 0) {
            this.game.attacks.splice(0);
        }
 
        this.game.enemies.forEach((enemy, index) => {

            
            if (currentX > enemy.x && 
                currentX < enemy.x + enemy.size &&
                currentY + 5 > enemy.y &&
                currentY < enemy.y + enemy.size
                ) {

                this.game.attacks.splice(0);
                
                this.game.enemies.splice(index, 1);
            }
        })

        
    }
}



class Wizard {

    constructor(x, y, game) {


        this.x = x;
        this.y = y;
        this.game = game;
        this.size = 50;
        this.speed = 4;
        this.currentFrame = 0;
        this.frameWidth = 128;
        this.spriteWidth = 120;
        this.spriteHeight = 100;

    }


    draw() {

        // this.game.ctx.fillStyle = 'red';
        // this.game.ctx.fillRect(this.x, this.y, this.size, this.size);
    
        this.game.ctx.drawImage(
            this.game.sorcererIdleImage,
            this.currentFrame * this.frameWidth,
            0, 
            this.spriteWidth,
            this.spriteHeight, 
            this.x, 
            this.y,
            this.spriteWidth,
            this.spriteHeight

        )

    }


    update() {


        if (this.currentFrame < 7) {

            this.currentFrame += 1;
        } else {

            this.currentFrame = 1;
        }
    }
}




class Skeleton {


    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.size = 50;
        this.speed = 4;
        this.currentFrame = 0;
        this.frameWidth = 128;
        this.spriteWidth = 120;
        this.spriteHeight = 100;
        this.direction = 'left';
        this.attacking = false;


    }


    draw() {

        let imageToDraw;

        if (this.direction == 'left') {

            imageToDraw = this.game.skeletonWarriorImageLeft;
        } else {
            imageToDraw = this.game.skeletonWarriorImage;
        }

        if (this.attacking && this.direction != 'left') {
            imageToDraw = this.game.skeletonAttackImageLeft;
        } else if (this.attacking && this.direction == 'right') {
            imageToDraw = this.game.skeletonAttackImage;
        }


        this.game.ctx.drawImage(

            imageToDraw,
            this.currentFrame * this.frameWidth,
            0, 
            this.spriteWidth,
            this.spriteHeight, 
            this.x, 
            this.y,
            this.spriteWidth,
            this.spriteHeight
        )



    }


    update() {

        if (this.currentFrame < 6) {
            this.currentFrame += 1;
        } else {

            this.currentFrame = 0;
        }



        let distance = Math.hypot((this.game.player.x - this.x), this.game.player.y - this.y);

        

        if (distance > 10) {


            if ((this.game.player.x - this.x) < 0) {
                this.x -= this.speed;
                this.direction = 'left';
                this.attacking = false;

            } else {
                this.x += this.speed;
                this.direction = 'right';
                this.attacking = false;
            }

            if ((this.game.player.y - this.y) < 0) {
                this.y -= this.speed;
            } else {
                this.y += this.speed;
            }
        } else {


            this.attack();
            this.attacking = true;
        }

        


    }


    attack() {

        
        this.game.player.health -= 1;
        if (this.game.player.health <= 0) {
            this.game.gameover = true;
        }
        
    }
}




const game = new Game(canvas, ctx);
game.update();
