// Check if word entered by player exists in the English language

const checkValidWord = (db, checkWord) => (request, response) => {
    const {id, word} = request.body;

    if (!word || word.length !== 5 || !checkWord.check(word.toLowerCase())) {
        return response.json('Not a valid five-letter English word.');
    }

    // SELECT word FROM current_word WHERE id = id
    db.select('word').from('current_word').where({id})
    .then(data => {
        data.length ?
        response.json(calculateBullsAndBears(data[0].word, word.toLowerCase()))
        :
        response.status(400).json('Error checking word.');
    })
    .catch(error => {
        response.status(400).json('Error checking word.');
    });
};

// Calculate number of bulls and bears in word entered by user

const calculateBullsAndBears = (correctWord, attemptedWord) => {
    let bulls = 0, bears = 0, bullPositions = [];

    // Calculate number of bulls
    for (let i = 0; i < attemptedWord.length; i++) {
        if (attemptedWord[i] === correctWord[i]) {
            bulls++;
            bullPositions.push(i);
        }
    }

    // Calculate number of bears
    for (let i = 0; i < attemptedWord.length; i++) {
        if (!bullPositions.includes(i)) {
            for (let j = 0; j < correctWord.length; j++) {
                if (attemptedWord[i] === correctWord[j]) {
                    bears++;
                    break;
                }
            }
        }
    }

    return {bulls, bears};
};

module.exports = {
    checkValidWord
};