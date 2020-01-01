// Update player's points and store the word won in database

const updatePoints = db => (request, response) => {
    const {id, word} = request.body;

    // Use transaction to ensure data is inserted into both or none of the tables
    db.transaction(transaction => {

        // UPDATE players SET points = points + 1 WHERE id = id
        db('players').where({id}).increment('points', 1).returning('points')
        .transacting(transaction)
        .then(async data => {

            // Ensure player exists
            if (!data.length) {
                return response.status(400).json('Player not found.');
            }

            // DELETE FROM current_word WHERE id = id, word = word
            const n = await db('current_word').where({id, word: word.toLowerCase()}).del()
            .transacting(transaction);

            // Ensure word completed by player and current word stored in database are same
            if (!n) {
                throw new Error();
            }

            // INSERT INTO words VALUES (id, word)
            await db('words_won').insert({id, word: word.toLowerCase()})
            .transacting(transaction);

            // Send updated points as response
            response.json(data[0]);
        })
        .then(transaction.commit)
        .catch(transaction.rollback)
    })
    .catch(error => {
        response.status(400).json('Error updating points.');
    });
};

module.exports = {
    updatePoints
};