import { RandomGenerator, Randomizer } from 'dice-rng-toolkit'
import { AudioPlayer } from './AudioPlayer.js'
import { ChordAndMelodyApp } from './ChordAndMelodyApp.js'
import { ChordProgressionGenerator } from './ChordProgressionGenerator.js'
import { GeneratorView } from './GeneratorView.js'
import { MelodyGenerator } from './MelodyGenerator.js'
import { ShareLink } from './ShareLink.js'
import { SongGenerator } from './SongGenerator.js'
import { FavoriteStorage } from './FavoriteStorage.js'

const randomGenerator = new RandomGenerator()
const randomizer = new Randomizer()

const songGenerator = new SongGenerator(
  randomGenerator,
  new ChordProgressionGenerator(randomGenerator, randomizer),
  new MelodyGenerator(randomGenerator, randomizer),
)

const app = new ChordAndMelodyApp({
  view: new GeneratorView(document),
  songGenerator,
  audioPlayer: new AudioPlayer(new AudioContext()),
  shareLink: new ShareLink(window.location),
  favoriteStorage: new FavoriteStorage(window.localStorage),
})

app.start()
