const startButton = document.getElementById('start');
const nameField = document.getElementById('name');
const sizeField = document.getElementById('size');
window.game = {};

const startGame = config => {
    if (config.size % 2 !== 0) {
        return Promise.reject('Invalid size');
    }
    return fetch(`/game/${config.size}`, {
            mode: 'cors'
        })
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText));
};


const endGame = (stats) => fetch('/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
            steps: stats.steps,
            token: stats.token,
            seconds: stats.seconds,
            name: stats.name
        })
    })
    .then(response => response.ok ? Promise.resolve() : Promise.reject());



/**
 * Handle start
 */
startButton.addEventListener('click', evt => {
    evt.preventDefault();
    const config = {
        size: sizeField.value,
        name: nameField.value
    };
    const el = document.getElementById('setup');

    startGame(config).then(game => {
        const gameObj = {
            flips: 0,
            flipped: [],
            startTime: Date.now(),
            token: game.token,
            name: config.name,
            cards: game.pictures.map(value => new Card(value))
        };

        el.innerHTML = '';
        gameObj.cards.forEach(card => el.appendChild(card.render()));
        window.game = gameObj;
    }).catch(err => el.innerText = err);
});


/**
 * Handle flips
 */
document.body.addEventListener('flip', (evt) => {
    const game = window.game;
    const card = evt.detail.card;
    game.flips++;
    game.flipped.push(card);
    if (game.flipped.length === 2) {
        game.cards.forEach(card => card.lock());
        window.setTimeout(() => {
            if (game.flipped.every(card => card.value === game.flipped[0].value)) {
                game.flipped.forEach(card => card.remove());
            } else {
                game.flipped.forEach(card => card.unflip());
            }
            game.flipped = [];
            game.cards.forEach(card => card.unlock());
            if (document.querySelectorAll('.card').length === 0) {
                endGame({
                    steps: game.flips / 2,
                    token: game.token,
                    seconds: Math.round((Date.now() - window.game.startTime) / 1000),
                    name: game.name
                }).then(_ => {
                    fetch('/score', {
                            mode: 'cors'
                        })
                        .then(response => response.json())
                        .then(response => {
                            document.getElementById('setup').innerHTML = `
                                <p>You won!</p>
                                <p><b>Scores:</b></p>
                                <table>
                                <tr><td>Name</td><td>Seconds</td><td>Steps</td>
                                    ${response.map(score => `<tr><td><b>${score.name}</b></td><td>${score.seconds}</td><td>${score.steps}</td></tr>`).join('')}
                                </table>
                            `;
                        });
                });
            }
        }, 1000);
    }
});