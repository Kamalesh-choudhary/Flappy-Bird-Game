let move_speed = 3, gravity = 0.3;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');
message.style.display = 'block';

let bird_dy = 0;
let sound_point = document.getElementById('sound_point') || { play: () => {} };
let sound_die = document.getElementById('sound_die') || { play: () => {} };

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach(pipe => pipe.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        bird_dy = 0;
        game_state = 'Play';
        message.innerHTML = '';
        message.style.display = 'none';
        message.classList.remove('messageStyle');
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        play();
    }

    if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
        img.src = 'assets/bird2.png';
        bird_dy = -7.6;
    }
});

document.addEventListener('keyup', (e) => {
    if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
        img.src = 'assets/bird1.png';
    }
});

function play() {
    function move_pipes() {
        if (game_state !== 'Play') return;

        let bird_props = bird.getBoundingClientRect();
        document.querySelectorAll('.pipe_sprite').forEach(pipe => {
            let pipe_props = pipe.getBoundingClientRect();

            if (pipe_props.right <= 0) {
                pipe.remove();
            } else {
                // Collision detection
                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    gameOver();
                    return;
                }

                // Score increment
                if (pipe_props.right < bird_props.left && pipe.increase_score === '1') {
                    score_val.innerHTML = Number(score_val.innerHTML) + 1;
                    pipe.increase_score = '0';
                    sound_point.play();
                }

                // Move pipe
                pipe.style.left = pipe_props.left - move_speed + 'px';
            }
        });

        requestAnimationFrame(move_pipes);
    }

    function apply_gravity() {
        if (game_state !== 'Play') return;

        bird_dy += gravity;
        bird.style.top = bird.offsetTop + bird_dy + 'px';

        let bird_props = bird.getBoundingClientRect();
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            gameOver();
            return;
        }

        requestAnimationFrame(apply_gravity);
    }

    let pipe_separation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;
            let pipe_pos = Math.floor(Math.random() * 43) + 8;


            // Top pipe
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_pos - 70 + 'vh';
            pipe_top.style.left = '100vw';

            document.body.appendChild(pipe_top);

            // Bottom pipe
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_pos + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';

            document.body.appendChild(pipe_bottom);
        }

        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }

    function gameOver() {
        game_state = 'End';
        img.style.display = 'none';
        message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
        message.style.display = 'block';
        message.classList.add('messageStyle');
        sound_die.play();
    }

    requestAnimationFrame(move_pipes);
    requestAnimationFrame(apply_gravity);
    requestAnimationFrame(create_pipe);
}
