// Register player

const handleRegister = (db, bcrypt) => (request, response) => {
    
    // Cost factor of calculating bcrypt hash
    const SALT_ROUNDS = 10;
    const {username, password} = request.body;

    // Ensure username and password are not blank
    if (!username || !username.trim()) {
        return response.status(400).json('Username cannot be blank.');
    } else if (!password || !password.trim()) {
        return response.status(400).json('Password cannot be blank.');
    }
    
    //INSERT INTO players (username, hash, joined) VALUES (username, hash, new Date())
    db('players').insert({
        username,
        hash: bcrypt.hashSync(password, SALT_ROUNDS),
        joined: new Date()
    }, ['id', 'username', 'points'])
    .then(data => {
        response.json(data[0]);
    })
    .catch(error => {
        error.constraint === 'players_username_key' ?
        response.json('Sorry, username already exists.')
        :
        response.status(400).json('Error registering.');
    });
};

module.exports = {
    handleRegister
};