import { Note } from 'music-theory-toolkit'
import { RandomGenerator } from 'dice-rng-toolkit'

const note = new Note('C4')
const randomGenerator = new RandomGenerator(42)

document.querySelector('#app').textContent =
  `${note.toString()} ${note.frequency} hz, random ${randomGenerator.nextInt(1, 6)}`
