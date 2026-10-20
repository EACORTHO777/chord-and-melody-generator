# Chord and Melody Generator

**Try the app:** https://chord-and-melody-generator.vercel.app

## Vision

- An application for musicians, developers or for people that want to learn the basics of how to make music. The app solves writer's block for musicians, and creates a easy way how to create basic chord progression or melodies based in the most common scales in music theory. It solves this problem by giving the user a easy tool for creating inspiring chord progressions or melodies that can be applied in existing work or a spark to new sessions.

## Requirements

- R1. User should be able to choose key
- R2. User should be able to generate chord progressions
- R3. User should be able to generate melodies
- R4. User should be able to have tones, chords and melodies played back in the browser.
- R5. Function to save users favorite chord progressions and or melodies.
- R6. A function to show the notes in a chord, a scale and relative minor/majors.
- R7. Option to save melodies and or chords down in MIDI to local device.
- R8. A share button to share the melody with friends or co musicians.

## How to use

1. Choose a **root note** and **Major** or **Minor**.
2. Press **Generate** to get a chord progression and a melody.
3. Press **Play** to hear them. Click a single note or chord to hear only that one.
4. Press **Save favorite** to keep the song. Favorites are saved in your browser.
5. Press **Share** to copy a link that recreates the exact same song.
6. Press **Download MIDI** to open the song in a DAW, e.g. FL Studio or GarageBand.

Only major and minor keys are supported, since the relative key and the chords of a key are only defined for seven-note major and minor scales in the module.

## For developers

### Run locally

Requires Node.js 18 or later.

```
git clone https://github.com/EACORTHO777/chord-and-melody-generator.git
cd chord-and-melody-generator
npm install
npm run dev
```

| Script           | What it does                   |
| ---------------- | ------------------------------ |
| `npm run dev`    | Starts the development server  |
| `npm run build`  | Builds the app to `dist/`      |
| `npm run lint`   | Checks the code with ESLint    |
| `npm run format` | Formats the code with Prettier |

### Modules used

- [music-theory-toolkit](https://github.com/EACORTHO777/music-theory-toolkit) (my own module) does all music theory: notes, scales, chords, relative keys, frequencies and MIDI numbers.
- [Dice-RNG-Toolkit](https://github.com/ThJoker3/Dice-RNG-Toolkit) (another student's module) gives seeded random numbers and weighted picks. The seed makes it possible to recreate a song from a share link or a favorite.

Both are installed from GitHub with npm and are not changed by the app.

### Architecture

`src/main.js` only creates the objects and connects them. Each class has one responsibility:

| Class                       | Responsibility                                             |
| --------------------------- | ---------------------------------------------------------- |
| `ChordAndMelodyApp`         | Connects the page to the other classes                     |
| `GeneratorView`             | Reads the user's choices and shows the results on the page |
| `SongGenerator`             | Generates a whole song from a key and a seed               |
| `ChordProgressionGenerator` | Picks a popular chord progression in the key               |
| `MelodyGenerator`           | Picks melody notes that fit each chord                     |
| `AudioPlayer`               | Plays notes, chords and songs with the Web Audio API       |
| `ShareLink`                 | Creates and reads links with the key and seed              |
| `FavoriteStorage`           | Saves favorites in `localStorage`                          |
| `MidiFileWriter`            | Creates a standard MIDI file from the song                 |

## Testing

See [TEST_REPORT.md](TEST_REPORT.md).
