const express = require('express'),
    app = express(),
    cors = require('cors'),
    Token = require('./token'),
    shuffle = require('shuffle-array'),
    random = require('./random'),
    Repository = require('./in-memory-repository'),
    pug = require('pug');

app.use(cors());
app.use(express.json());

const cards = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

class IRepository {
    /** @type Promise<Array> */
    get items() {
        throw new Error('not implemented');
    }
    /**
     * Get item by id.
     * @param {String|Number} id
     * @return {Promise<Object>} - Object with the requested id;
     */
    get(id) {
        throw new Error('not implemented');
    }
    /**
     * Insert or update object in the repository.
     * @param {Object} item
     * @return {Promise}
     */
    insert(item) {
        throw new Error('not implemented');
    }
}

/**
 * @type IRepository
 */
const gameRepository = new Repository('token', 'game');


/**
 * @name asyncHandler
 * @param {function(Request,Response,NextFunction):Promise} fn
 */
const asyncHandler = fn =>
    /**
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    (req, res, next) =>
    fn(req, res, next)
    .catch(next);



app.get('/game/:size', asyncHandler(async (req, res) => {
    const size = parseInt(req.params.size, 10);
    if (!size || size < 6 || size > 20 || size % 2 !== 0) {
        res.sendStatus(400);
    } else {
        const pictures = [];
        while (pictures.length < size) {
            const c = cards[random(0, cards.length-1)];
            pictures.push(c, c);
        }

        shuffle(pictures);

        const game = {
            token: Token.create(),
            pictures: pictures
        };

        try {
            await gameRepository.insert(game);
            res.send(game);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
}));

app.listen(process.env.PORT || 80);