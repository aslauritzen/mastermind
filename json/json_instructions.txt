I have the JSON data found in /sample_state.json in two places on the page.
I wasn't entirely sure about the specifications, so I have the JSON itself being displayed
in a Div on the right side of the page, as well as the the data being added to the game board.

I opted to make a "save state" for the game. When you log in at index.html (or go
directly to /mastermind.html), you are taken to the game start page. You have the option
to either start a game normally, or click the Load Sample Game button. Doing this will
fetch the JSON and build the game board from the JSON. From that point the game will be
fully playable.

I tried to make the sample_state.json pretty intuitive. The most important thing is that
all of the data you input matches. I didn't plan for an improperly built sample_state.
This means that the code length you set must be the code length for the secret code
and for all of the guesses. The guesses and secret codes can use the numbers 1-7.
The responses can be either 1 or 2. The responses can be anything between empty arrays
up to arrays of 1's and 2's equaling the code length The game rounds can be any number.
The current round number must equal the number of both guesses and responses up to one less
than the number of game rounds.

Setting the mode to 0 will begin a player game (a game where the player guesses) and a 1 will
begin a computer game (one where the computer guesses)..