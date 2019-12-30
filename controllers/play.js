// Pick a word for the user to play

const getWord = (db, words) => (request, response) => {
    const {id} = request.params;

    // Select a random word from the list
    let word = words[Math.floor(Math.random() * 500)];

    // SELECT id FROM users WHERE id = id
    db.select('id').from('users').where({id})
    .then(data => {

        // Ensure user exists
        if (data.length) {

            // SELECT words_won FROM words WHERE id = id
            db.select('word').from('words_won').where({id})
            .then(data => {

                // Ensure user has not already found out all the words in the list
                if (data.length === 500) {
                    return response.json('You have found out all the words I had thought of!');
                }

                // Ensure chosen word is not already in user's words-won list
                if (data.length) {
                    while (data.map(object => object['word']).includes(word)) {
                        word = words[Math.floor(Math.random() * 500)];
                    }
                }

                // Store in database the word that the user is currently playing
                // INSERT INTO current_word VALUES (id, word)
                db('current_word').insert({id, word})
                .then(data => {
                    response.json('success');
                })
                .catch(error => {

                    // If user already has a current word, UPDATE current_word SET word = word WHERE id = id
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
            response.status(400).json('User not found.');
        }
    })
    .catch(error => {
        response.status(400).json('Error fetching word.');
    });
};

module.exports = {
    getWord
};