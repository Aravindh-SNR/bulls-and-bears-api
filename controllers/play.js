// Pick a word for the player to play

const getWord = (db, words) => (request, response) => {
    const {id} = request.params;

    // Select a random word from the list
    let word = words[Math.floor(Math.random() * 500)];

    // SELECT id FROM players WHERE id = id
    db.select('id').from('players').where({id})
    .then(data => {

        // Ensure player exists
        if (data.length) {

            // SELECT words_won FROM words WHERE id = id
            db.select('word').from('words_won').where({id})
            .then(data => {

                // Ensure player has not already found out all the words in the list
                if (data.length === 500) {
                    return response.json('You have played all the words I had thought of!');
                }

                // Ensure chosen word is not already in user's words-won list
                if (data.length) {
                    while (data.map(object => object['word']).includes(word)) {
                        word = words[Math.floor(Math.random() * 500)];
                    }
                }

                // Store in database the word that the player is currently playing
                // INSERT INTO current_word VALUES (id, word)
                db('current_word').insert({id, word})
                .then(data => {
                    response.json('success');
                })
                .catch(error => {

                    // If player already has a current word, UPDATE current_word SET word = word WHERE id = id
                    error.constraint === 'current_word_pkey' ?
                    db('current_word').where({id}).update({word})
                    .then(data => {
                        response.json('success');
                    })
                    .catch(error => {
                        response.status(400).json('Error fetching word.');
                    })
                    : response.status(400).json('Error fetching word.');
                });
            })
            .catch(error => {
                response.status(400).json('Error fetching word.');
            });
        } else {
            response.status(400).json('Player not found.');
        }
    })
    .catch(error => {
        response.status(400).json('Error fetching word.');
    });
};

module.exports = {
    getWord
};