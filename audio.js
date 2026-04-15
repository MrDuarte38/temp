// get access to my_output element in html
let console = document.getElementById("my_output");

function console_log(my_string) {
    console.textContent = console.textContent + "\n>>" + my_string;
}

let WIDTH = 800;
let HEIGHT = 600;

// get access to html canvas element
let canvas = document.getElementById("myCanvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

// get access to the drawing context of the canvas
let context = canvas.getContext("2d");

// get access to all the buttons
let btn_start = document.getElementById("btn_start");
btn_start.addEventListener("click", btn_start_handler);
let btn_add_one = document.getElementById("btn_add_one");
btn_add_one.addEventListener("click", btn_add_one_handler);
let btn_sub_one = document.getElementById("btn_game_over");
btn_sub_one.addEventListener("click", btn_game_over_handler);
let btn_reset = document.getElementById("btn_reset");
btn_reset.addEventListener("click", btn_reset_handler);

document.addEventListener("keydown", keydown_handler);
document.addEventListener("keyup", keyup_handler);

// Keydown Variables
let arrow_right_down = false;
let arrow_left_down = false;
let arrow_up_down = false;

function keydown_handler(event) {
    if (event.key == "ArrowRight")
        arrow_right_down = true;
    if (event.key == "ArrowLeft")
        arrow_left_down = true;
    if (event.key == " ") {
        shoot_projectile(player);
        play_laser_sound();
    }
    if (event.key == "ArrowUp")
        arrow_up_down = true;
}

function keyup_handler(event) {
    if (event.key == "ArrowRight")
        arrow_right_down = false;
    if (event.key == "ArrowLeft")
        arrow_left_down = false;
    if (event.key == "ArrowUp")
        arrow_up_down = false;
}

function shoot_projectile(player) {
    let tx = player.xpos + player.rad * Math.cos(player.angle * Math.PI / 180);
    let ty = player.ypos + player.rad * Math.sin(player.angle * Math.PI / 180);

    let unit_x = (tx - player.xpos) / player.rad;
    let unit_y = (ty - player.ypos) / player.rad;

    let proj_speed = 7;

    let temp_proj = {
        xpos: player.xpos,
        ypos: player.ypos,
        rad: 5,
        color: "RGB(0,255,0)",
        dx: unit_x * proj_speed, // fix later
        dy: unit_y * proj_speed, // fix later
        text: "B",
        mass: 1
    };

    projectile_array.push(temp_proj);
}

function update_projectile(projectile) {
    projectile.xpos = projectile.xpos + projectile.dx;
    projectile.ypos = projectile.ypos + projectile.dy;
}

function draw_projectile(projectile) {
    context.beginPath();
    context.fillStyle = projectile.color;
    context.arc(projectile.xpos, projectile.ypos,
        projectile.rad, 0, 2 * Math.PI, false);
    context.fill();
}

function draw_scoreboard() {
    context.font = "24px Arial";
    context.fillStyle = "black";
    context.fillText("Score: " + score, 50, 30);
}


// Game Variables
const menu_image = new Image();
menu_image.src = "./images/start_menu.png";

const end_image = new Image();
end_image.src = "./images/game_over.png";

const bg_image = new Image();
bg_image.src = "./images/background.png";

const laser_audio = new Audio();
laser_audio.src = "./audio/laser.wav";

const explosion_audio = new Audio();
explosion_audio.src = "./audio/explosion.wav";

const background_audio = new Audio();
background_audio.src = "./audio/background.wav";



let game_state = "start";
let score = 0;
let projectile_array = [];
let circle_array = [];
let coins_array = [];
let frame_counter = 0;
let rect = {
    xpos: 0,
    ypos: 0,
    width: WIDTH,
    height: HEIGHT,
    color: "white"
};

let circle1 = {
    xpos: 0,
    ypos: 290,
    rad: 30,
    color: "RGB(0,0,255)",
    dx: 5,
    dy: 0,
    text: "C1",
    mass: 2
};

let circle2 = {
    xpos: 303,
    ypos: 304,
    rad: 20,
    color: "RGB(0,0,255)",
    dx: 0,
    dy: 0,
    text: "C2",
    mass: 1
};

let circle3 = {
    xpos: 100,
    ypos: 304,
    rad: 20,
    color: "RGB(0,0,255)",
    dx: 1,
    dy: 1,
    text: "C2",
    mass: 1
};

circle_array.push(circle1);
circle_array.push(circle2);
circle_array.push(circle3);

let player = {
    xpos: 400,
    ypos: 500,
    rad: 20,
    color: "RGB(255,0,0)",
    dx: 0,
    dy: 0,
    text: "",
    angle: 90
};

function play_bg_music() {
    background_audio.loop = true;
    background_audio.volume = 0.1;
    background_audio.play();
}

function stop_bg_music() {
    background_audio.pause();
}

function play_laser_sound() {
    laser_audio.currentTime = 0; //rewind so it can replay quickly
    laser_audio.play();
}

function play_explosion_sound() {
    explosion_audio.currentTime = 0;
    explosion_audio.play();
}

function rotate_left(player) {
    player.angle = player.angle - 1;
}

function rotate_right(player) {
    player.angle = player.angle + 1;
}

function draw_player(player) {
    context.beginPath();
    context.fillStyle = player.color;
    context.arc(player.xpos, player.ypos,
        player.rad, 0, 2 * Math.PI, false);
    context.fill();

    // draw pointer
    context.strokeStyle = "black";
    context.lineWidth = "3";
    context.beginPath();
    context.moveTo(player.xpos, player.ypos);
    context.lineTo(player.xpos +
        player.rad * Math.cos(player.angle * Math.PI / 180),
        player.ypos +
        player.rad * Math.sin(player.angle * Math.PI / 180));
    context.stroke();
    context.closePath();

}


function update_player(player) {
    if (arrow_left_down)
        player.angle = player.angle - 5;
    if (arrow_right_down)
        player.angle = player.angle + 5;

    // calculate new unit vector for player
    let tx = player.xpos + player.rad * Math.cos(player.angle * Math.PI / 180);
    let ty = player.ypos + player.rad * Math.sin(player.angle * Math.PI / 180);

    let unit_x = (tx - player.xpos) / player.rad;
    let unit_y = (ty - player.ypos) / player.rad;

    if (arrow_up_down) // Arrow up has been pressed
    {
        player.xpos = player.xpos + 5 * unit_x;
        player.ypos = player.ypos + 5 * unit_y;
    }
    else // Arrow up has been released
    {
        player.xpos = player.xpos + unit_x;
        player.ypos = player.ypos + unit_y;
    }

    if (player.xpos < 0)
        player.xpos = 0;
    if (player.xpos > WIDTH)
        player.xpos = WIDTH
    if (player.ypos < 0)
        player.ypos = 0;
    if (player.ypos > HEIGHT)
        player.ypos = HEIGHT;
}


function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + Math.pow((y1 - y2), 2));
}

function is_intersecting(obj1, obj2) {
    // boolean expression
    return (distance(obj1.xpos, obj1.ypos, obj2.xpos, obj2.ypos) <= obj1.rad + obj2.rad);
}

// Math.random 0 - 1
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resolve_collision(obj1, obj2) {
    let new_dx1 = obj1.dx - (calc_mass_factor(obj1, obj2) * (calc_dot_product(obj1, obj2) /
        mag_pos_squared(obj1, obj2))) * (obj1.xpos - obj2.xpos);
    let new_dy1 = obj1.dy - (calc_mass_factor(obj1, obj2) * (calc_dot_product(obj1, obj2) /
        mag_pos_squared(obj1, obj2))) * (obj1.ypos - obj2.ypos);

    let new_dx2 = obj2.dx - (calc_mass_factor(obj2, obj1) * (calc_dot_product(obj2, obj1) /
        mag_pos_squared(obj2, obj1))) * (obj2.xpos - obj1.xpos);
    let new_dy2 = obj2.dy - (calc_mass_factor(obj2, obj1) * (calc_dot_product(obj2, obj1) /
        mag_pos_squared(obj2, obj1))) * (obj2.ypos - obj1.ypos);


    return { new_dx1, new_dy1, new_dx2, new_dy2 };

}

function mag_pos_squared(obj1, obj2) {
    return Math.pow((obj1.xpos - obj2.xpos), 2) +
        Math.pow((obj1.ypos - obj2.ypos), 2);
}

function calc_dot_product(obj1, obj2) {
    diff_vx = obj1.dx - obj2.dx;
    diff_vy = obj1.dy - obj2.dy;
    diff_px = obj1.xpos - obj2.xpos;
    diff_py = obj1.ypos - obj2.ypos;

    return (diff_vx * diff_px + diff_vy * diff_py);
}


function calc_mass_factor(obj1, obj2) {
    return (2 * obj2.mass) / (obj1.mass + obj2.mass);
}


function draw_circle(circle) {
    // draw circle
    context.beginPath();
    context.fillStyle = circle.color;
    context.arc(circle.xpos, circle.ypos, circle.rad, 0, 2 * Math.PI, false);
    context.fill();

    // draw text
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(circle.text, circle.xpos, circle.ypos);

}

function clearScreen(rect) {
    context.fillStyle = rect.color;
    context.fillRect(rect.xpos, rect.ypos, rect.width, rect.height);
}

function btn_start_handler() {
    console_log("Start Button Clicked");

    // don't allow user to create multiple game loops
    btn_start.disabled = true;
    play_bg_music();

    game_state = "playing";
}

function update_circle_position(circle) {
    circle.xpos = circle.xpos + circle.dx;
    circle.ypos = circle.ypos + circle.dy;

    // Hit left or right wall
    if (circle.xpos >= WIDTH || circle.xpos <= 0) {
        circle.dx = circle.dx * -1;
    }

    // Hit top or bottom wall
    if (circle.ypos >= HEIGHT || circle.ypos <= 0) {
        circle.dy = circle.dy * -1;
    }
}

function create_more_coins() {
    coins_array.push({
        xpos: WIDTH / 2,
        ypos: HEIGHT / 2,
        rad: 12,
        color: "RGB(6,92,39)",
        dx: 0,
        dy: 0,
        text: "$",
        mass: 0
    });

    coins_array.push({
        xpos: WIDTH / 4,
        ypos: HEIGHT / 4,
        rad: 12,
        color: "RGB(6,92,39)",
        dx: 0,
        dy: 0,
        text: "$",
        mass: 0
    });

    coins_array.push({
        xpos: WIDTH - WIDTH / 4,
        ypos: HEIGHT / 4,
        rad: 12,
        color: "RGB(6,92,39)",
        dx: 0,
        dy: 0,
        text: "$",
        mass: 0
    });

    coins_array.push({
        xpos: WIDTH / 4,
        ypos: HEIGHT - HEIGHT / 4,
        rad: 12,
        color: "RGB(6,92,39)",
        dx: 0,
        dy: 0,
        text: "$",
        mass: 0
    });

    coins_array.push({
        xpos: WIDTH - WIDTH / 4,
        ypos: HEIGHT - HEIGHT / 4,
        rad: 12,
        color: "RGB(6,92,39)",
        dx: 0,
        dy: 0,
        text: "$",
        mass: 0
    });
    /*
         
             
                     temp_coin.xpos = WIDTH - WIDTH/4;
                             temp_coin.ypos = HEIGHT - HEIGHT/4;
                                     coins_array.push(temp_coin);
                                         */
}

function draw_coin(coin) {
    // draw circle
    context.beginPath();
    context.fillStyle = coin.color;
    context.arc(coin.xpos, coin.ypos, coin.rad, 0, 2 * Math.PI, false);
    context.fill();

    // draw text
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(coin.text, coin.xpos, coin.ypos);
}

function display_menu() {
    context.drawImage(menu_image, 0, 0, WIDTH, HEIGHT);
}

function display_game_over() {
    context.drawImage(end_image, 0, 0, WIDTH, HEIGHT);

    // draw text
    context.font = "60px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Score: " + score, WIDTH / 2, HEIGHT - 100);
}

function game_loop() {
    clearScreen(rect);

    if (game_state == "start") {
        // code for starting screen
        display_menu();

    } else if (game_state == "gameover") {
        // code for playing
        display_game_over();
    } else if (game_state == "playing") {
        context.drawImage(bg_image, 0, 0, WIDTH, HEIGHT);

        draw_scoreboard();

        if (coins_array.length == 0)
            create_more_coins();

        if (coins_array.length > 0) {
            for (let i = 0; i < coins_array.length; i++) {
                draw_coin(coins_array[i]);
            }
        }

        // check collision coins - player
        for (let i = coins_array.length - 1; i >= 0; i--) {
            if (is_intersecting(coins_array[i], player)) {
                coins_array.splice(i, 1);
                score = score + 10;
            }
        }

        // check collision enemies & player
        for (let i = 0; i < circle_array.length; i++) {
            if (is_intersecting(circle_array[i], player)) {
                game_state = "gameover";
                play_explosion_sound();
                stop_bg_music();
                break; // end this loop
            }
        }

        // update and draw circles
        if (circle_array.length > 0) {
            for (let i = 0; i < circle_array.length; i++) {
                draw_circle(circle_array[i]);
                update_circle_position(circle_array[i]);
            }
        }

        // check collisions of circles
        if (circle_array.length >= 2) {
            for (let i = 0; i < circle_array.length - 1; i++) {
                for (let j = i + 1; j < circle_array.length; j++) {
                    if (is_intersecting(circle_array[i], circle_array[j])) {
                        let temp = resolve_collision(circle_array[i], circle_array[j]);
                        circle_array[i].dx = temp.new_dx1;
                        circle_array[i].dy = temp.new_dy1;
                        circle_array[j].dx = temp.new_dx2;
                        circle_array[j].dy = temp.new_dy2;
                    }
                }
            }
        }

        // update and draw projectiles
        if (projectile_array.length > 0) {
            for (let i = projectile_array.length - 1; i >= 0; i--) {
                update_projectile(projectile_array[i]);
                draw_projectile(projectile_array[i]);
                if (projectile_array[i].xpos < 0 || projectile_array[i].xpos > WIDTH ||
                    projectile_array[i].ypos < 0 || projectile_array[i].ypos > HEIGHT) {
                    projectile_array.splice(i, 1);
                }
            }
        }

        // check collision between bullets and circles
        if (projectile_array.length > 0 && circle_array.length > 0) {
            for (let p = projectile_array.length - 1; p >= 0; p--) {
                for (let c = circle_array.length - 1; c >= 0; c--) {
                    if (distance(projectile_array[p].xpos, projectile_array[p].ypos,
                        circle_array[c].xpos, circle_array[c].ypos) <= projectile_array[p].rad + circle_array[c].rad) {
                        let temp2 = resolve_collision(circle_array[c], projectile_array[p]);
                        circle_array[c].dx = temp2.new_dx1;
                        circle_array[c].dy = temp2.new_dy1;
                        projectile_array.splice(p, 1);
                        break;
                    }
                }
            }
        }

        // draw player
        update_player(player);
        draw_player(player);
    }

    frame_counter++;
    requestAnimationFrame(game_loop);
}

function btn_add_one_handler() {
    let temp_circle = {
        xpos: randomInt(50, WIDTH - 50),
        ypos: randomInt(50, HEIGHT - 50),
        rad: 20,
        color: "RGB(0,0,255)",
        dx: randomInt(-5, 5),
        dy: randomInt(-5, 5),
        text: String(circle_array.length),
        mass: 2
    };

    circle_array.push(temp_circle);
};

function btn_game_over_handler() {
    game_state = "gameover";
}
function btn_reset_handler() {
    location.reload();
}


requestAnimationFrame(game_loop);





/*
    // check to see if array is not empty
        if(circle_array.length > 0)
            {
                    // for each circle update the circles position and draw it
                            for(let i=0; i<circle_array.length;i++)
                                    {
                                                update_circle_position(circle_array[i]);
                                                            draw_circle(circle_array[i]);
                                                                    }
                                                                        }
                                                                            */