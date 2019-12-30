// Sign in user

const handleSignIn = (db, bcrypt) => (request, response) => {
    const {username, password} = request.body;

    // SELECT username, hash FROM users WHERE username = username
    db.select('*').from('users').where({username})
    .then(data => {
        
        // Check if password hashes match
        data.length && bcrypt.compareSync(password, data[0].hash) ?
        response.json({
            id: data[0].id,
            username: data[0].username,
            points: data[0].points
        })
        :
        response.json('Incorrect username and/or password.');
    })
    .catch(error => {
        response.status(400).json('Error signing in.');
    });
};

module.exports = {
    handleSignIn
};