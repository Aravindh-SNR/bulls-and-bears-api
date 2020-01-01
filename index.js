const express = require('express');
const cors = require('cors');

// Library for hashing passwords
const bcrypt = require('bcrypt');

// Library to check if a word exists in the English language
const checkWord = require('check-word')('en');

// Query builder library to connect with postgres database
const db = require('knex')({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    }
});

const app = express();

app.use(express.json());
app.use(cors());

// Load file containing 500 five-letter English words
const words = require('./static/words.json');

const signIn = require('./controllers/signIn');
const register = require('./controllers/register');
const play = require('./controllers/play');
const check = require('./controllers/check');
const points = require('./controllers/points');
const leaderboard = require('./controllers/leaderboard');

app.get('/', (request, response) => {response.send('I am ready to play Bulls & Bears!')});
app.post('/signin', signIn.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/play/:id', play.getWord(db, words));
app.post('/check', check.checkValidWord(db, checkWord));
app.put('/points', points.updatePoints(db));
app.get('/leaderboard', leaderboard.generateLeaderboard(db));

app.listen(process.env.PORT || 3000);