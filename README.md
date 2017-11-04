# snak3

A "3D"-ish take on the classic snake game using ThreeJS.

### Running

1.  `npm install`
2.  `npm start` will spin up the dev-server
3.  Visit `http://localhost:8080`

# Controls

Use arrow keys to change direction, shift to go in and ctrl to go out.

# Things that need doing:

- [ ] app
<!--   - [ ] new views
    - [ ] playing instructions
    - [ ] high score listings screen
    - [ ] high score entry screen
    - [ ] scoring enhancements
 -->
    - [ ] keep a record of all scoring events and some state during the game `{score, timestamp, snakelength, timeplayed}`
<!--     - [ ] difficulty level provides a multiplier
    - [ ] Adjust snake extensions by difficulty level ( harder === more extensions per level up )
 -->
- [ ] server
  - [ ] serves up the build assets
  - [ ] some database for high scores
  - [ ] api for sending and receiving scores
