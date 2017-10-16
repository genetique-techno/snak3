# snak3 #

A "3D"-ish take on the classic snake game using ThreeJS.

### Running ###

Run the app's dev-server using npm:

`npm start`

Visit `http://localhost:8080/`.

# Controls

Use arrow keys to change direction, shift to go in and ctrl to go out.

# Things that need doing: #

- [ ] bugs
  - [ ] You can crash into yourself sometimes (backwards into your snake shouldn't be allowed)
- [ ] app
  - [ ] new views
    - [ ] playing instructions
    - [ ] high score listings screen
    - [ ] high score entry screen
  - [ ] scoring enhancements
  	- [ ] difficulty level provides a multiplier
    - [ ] Adjust snake extensions by difficulty level ( harder === more extensions per level up )
    - [ ] keep a record of all scoring events and some state during the game `{score, timestamp, snakelength, timeplayed}`
- [ ] server
  - [ ] serves up the build assets
  - [ ] some database for high scores
  - [ ] api interface for sending and receiving scores
