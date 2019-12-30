// Get user profile

const getUserProfile = db => (request, response) => {
    const {id} = request.params;

    // SELECT username, hash FROM users WHERE username = username
    db.select('id', 'username', 'points').from('users').where({id})
    .then(data => {
        data.length ? response.json(data[0]) : response.json('User not found.');
    })
    .catch(error => {
        response.status(400).json('Error fetching user profile.');
    });
};

module.exports = {
    getUserProfile
};