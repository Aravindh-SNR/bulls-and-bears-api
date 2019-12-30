// Generate leaderboard of users based on points

const generateLeaderboard = db => (request, response) => {

    // SELECT username, points FROM users ORDER BY points DESC
    db.select('username', 'points').from('users').orderBy('points', 'desc')
    .then(data => {
        data.length ?
        response.json(data)
        :
        response.json('No rankings yet.');
    })
    .catch(error => {
        response.status(400).json('Error fetching leaderboard.');
    });
};

module.exports = {
    generateLeaderboard
};