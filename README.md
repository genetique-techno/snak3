# snak3 #

A "3D"-ish take on the classic snake game using ThreeJS.

### Running ###

Run the dev-server with this command:

`webpack-dev-server`

Visit `http://localhost:8080/`.

# Controls

Use arrow keys to change direction, shift to go in and ctrl to go out.

# Things that need doing: #

X Add Scoring
	- difficulty level provides a multiplier

- Adjust snake extensions by difficulty level ( harder === more extensions per level up )

- Add playing instructions

- Add high score listings screen

- Add high score entry screen

X AudioEngine
  X sound library
k
X Fix bug that allows menu incrementing when it's not displayed

- You can crash into yourself sometimes (backwards into your snake shouldn't be allowed)

X Window Resizing triggers new aspect ratio
