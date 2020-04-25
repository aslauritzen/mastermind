class Mastermind {
    constructor(num_cols, num_rows, sample=false) {
        this.player_score = 0;
        this.computer_score = 0;
        this.secret_code = [];
        this.guesses = [];
        this.responses = [];
        this.code_length = num_cols;
        this.game_rounds = num_rows;
        this.current_round = 0;
        this.possible_combos = [];
        this.valid_numbers = [1, 2, 3, 4, 5, 6, 7];
        this.comp_guess = [];
        this.mode = -1;
        if (!sample) {
            this.generateCode();
        }
    }
    setCode(code) {
        this.secret_code = code;
    }
    setPegs(pegs) {
        this.code_length = pegs;
    }
    setRounds(rounds) {
        this.game_rounds = rounds;
    }
    guess(code) {
        this.guesses.push(code);
        this.current_round++;
        return JSON.stringify(code) === JSON.stringify(this.secret_code);
    }
    response(code) {
        let response_result = [];
        let secret_code_copy = JSON.parse(JSON.stringify(this.secret_code));

        for (let i = 0; i < this.code_length; i++) {
            if (code[i] === secret_code_copy[i]) {
                response_result.push(2);
                code[i] = 0;
                secret_code_copy[i] = 0;
            }
        }

        for (let i = 0; i < this.code_length; i++) {
            if (code [i] !== 0 && secret_code_copy.indexOf(code[i]) > -1) {
                response_result.push(1);
                secret_code_copy[secret_code_copy.indexOf(code[i])] = 0;
                code[i] = 0;
            }
        }

        let return_array = this.shuffle(response_result);
        this.responses.push(return_array);
        return return_array;
    }
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    getRoundTotal() {
        return this.game_rounds;
    }
    getCodeLength() {
        return this.code_length;
    }
    getRandomInt(min=1, max=8) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    generateCode() {
        let secret_code = [];
        for (let i = 0; i < this.code_length; i++) {
            secret_code.push(this.getRandomInt());
        }
        this.setCode(secret_code);
    }
    getCurrentRound() {
        return this.current_round;
    }
    incrementScore(mode) {
        if (mode === 0) {
            this.computer_score++;
        }
        else {
            this.player_score++;
        }
    }
    async loadFromSample(sample) {
        return new Promise(async (resolve) => {
            this.setCode(sample.secret_code);
            this.guesses = sample.guesses;
            this.responses = sample.responses;
            this.current_round = sample.current_round;
            this.player_score = sample.player_score;
            this.computer_score = sample.computer_score;
            this.mode = sample.mode;

            if (this.mode === 1) {
                await this.getAllPossibleCombos();
                for (let i = 0; i < this.current_round; i++) {
                    await this.removeCombos(this.guesses[i], this.responses[i]);
                }
            }
            resolve();
        });
    }
    getComputerScore() {
        return this.computer_score;
    }
    getPlayerScore() {
        return this.player_score;
    }
    getAllPossibleCombos() {
        return new Promise(async (resolve) => {
            for (let s1 = 0; s1 < this.valid_numbers.length; s1++) {
                for (let s2 = 0; s2 < this.valid_numbers.length; s2++) {
                    for (let s3 = 0; s3 < this.valid_numbers.length; s3++) {
                        for (let s4 = 0; s4 < this.valid_numbers.length; s4++) {
                            if (this.code_length > 4) {
                                for (let s5 = 0; s5 < this.valid_numbers.length; s5++) {
                                    if (this.code_length > 5) {
                                        for (let s6 = 0; s6 < this.valid_numbers.length; s6++) {
                                            this.possible_combos.push([this.valid_numbers[s1], this.valid_numbers[s2], this.valid_numbers[s3], this.valid_numbers[s4], this.valid_numbers[s5], this.valid_numbers[s6]]);
                                        }
                                    }
                                    else {
                                        this.possible_combos.push([this.valid_numbers[s1], this.valid_numbers[s2], this.valid_numbers[s3], this.valid_numbers[s4], this.valid_numbers[s5]]);
                                    }
                                }
                            }
                            else {
                                this.possible_combos.push([this.valid_numbers[s1], this.valid_numbers[s2], this.valid_numbers[s3], this.valid_numbers[s4]]);
                            }
                        }
                    }
                }
            }
            resolve();
        });

    }
    removeCombos(guess, answer) {
        let correct = 0;
        let maybe = 0;
        for (let ans of answer) {
            if (ans === 1) {
                maybe++;
            }
            else {
                correct++;
            }
        }
        let answerToGuess = this.answerToGuess;
        return new Promise(async (resolve) => {
            this.possible_combos = this.possible_combos.filter(function(value, index, arr) {
                return answerToGuess(answer, JSON.parse(JSON.stringify(guess)), JSON.parse(JSON.stringify(value)));
            });
            resolve();
        });
    }
    answerToGuess(answer, guess, value) {
        let match = 0;
        let possible = 0;
        let ans_match = 0;
        let ans_possible = 0;
        let num_pegs = guess.length;

        for (let i = 0; i < num_pegs; i++) {
            if (value[i] === guess[i]) {
                match++;
                value[i] = 0;
                guess[i] = 0;
            }
        }

        for (let i = 0; i < num_pegs; i++) {
            if (value [i] !== 0 && guess.indexOf(value[i]) > -1) {
                possible++;
                guess[guess.indexOf(value[i])] = 0;
                value[i] = 0;
            }
        }

        for (let ans of answer) {
            if (ans === 2) {
                ans_match++;
            }
            else {
                ans_possible++;
            }
        }

        return match === ans_match && possible === ans_possible;
    }
    makeGuess() {
        this.comp_guess = this.possible_combos[Math.floor(Math.random() * this.possible_combos.length)];
        return this.comp_guess;
    }
    async startComputerTurn() {
        await this.getAllPossibleCombos();
        return this.possible_combos[Math.floor(Math.random() * this.possible_combos.length)];
    }
    takeAnswer(answer) {
        if (this.comp_guess.length > 0) {
            this.removeCombos(this.comp_guess, answer);
        }
        this.current_round++;
    }
    restartGame() {
        this.secret_code = [];
        this.guesses = [];
        this.responses = [];
        this.current_round = 0;
        this.possible_combos = [];
        this.comp_guess = [];
    }
}