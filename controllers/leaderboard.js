// Generate leaderboard of users based on points

const generateLeaderboard = db => (request, response) => {

    // SELECT username, points FROM users ORDER BY points DESC, id ASC
    db.select('id', 'username', 'points').from('users')
    .orderBy([{column: 'points', order: 'desc'}, {column: 'id'}])
    .then(data => {
        response.json(data.length ? data : 'No rankings yet.');
    })
    .catch(error => {
        response.status(400).json('Error fetching leaderboard.');
    });
};

module.exports = {
    generateLeaderboard
};