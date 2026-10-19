import { RandomGenerator, Randomizer } from 'dice-rng-toolkit'
import { AudioPlayer } from './AudioPlayer.js'
import { ChordAndMelodyApp } from './ChordAndMelodyApp.js'
import { ChordProgressionGenerator } from './ChordProgressionGenerator.js'
import { GeneratorView } from './GeneratorView.js'
import { MelodyGenerator } from './MelodyGenerator.js'

const randomGenerator = new RandomGenerator()
const randomizer = new Randomizer()

const app = new ChordAndMelodyApp(
  new GeneratorView(document),
  new ChordProgressionGenerator(randomGenerator, randomizer),
  new MelodyGenerator(randomGenerator, randomizer),
  new AudioPlayer(new AudioContext()),
)

app.start()
