// Update player's points and store the word played in database

const updatePoints = db => (request, response) => {
    const {id, points} = request.body;

    // SELECT word FROM current_word WHERE id = id
    db.select('word').from('current_word').where({id})
    .then(data => {

        // Use transaction to ensure data is updated in both or none of the tables
        db.transaction(transaction => {

            // INSERT INTO words_won VALUES (id, data[0].word)
            // table name 'words_won' is misleading, think of it as 'words_played'
            db('words_won').insert({id, word: data[0].word})
            .transacting(transaction)
            .then(async result => {

                // UPDATE players SET points = points + points WHERE id = id
                points &&
                await db('players').where({id}).increment('points', points)
                .transacting(transaction);

                // Send current word as response
                response.json({word: data[0].word});
            })
            .then(transaction.commit)
            .catch(transaction.rollback)
        })
        .catch(error => {
            response.status(400).json('Error updating points.');
        });
    })
    .catch(error => {
        response.status(400).json('Error updating points.');
    });
};

module.exports = {
    updatePoints
};