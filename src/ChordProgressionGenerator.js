/** @typedef {import('dice-rng-toolkit').RandomGenerator} RandomGenerator */
/** @typedef {import('dice-rng-toolkit').Randomizer} Randomizer */
/** @typedef {import('music-theory-toolkit').Scale} Scale */
/** @typedef {import('music-theory-toolkit').Chord} Chord */

/**
 * Popular chord progressions as scale degrees where 0 is the first chord of the scale.
 * A higher weight makes a progression more likely to be picked
 */
const POPULAR_PROGRESSIONS = [
  { degrees: [0, 4, 5, 3], weight: 5 },
  { degrees: [0, 3, 4, 0], weight: 4 },
  { degrees: [5, 3, 0, 4], weight: 3 },
  { degrees: [1, 4, 0, 0], weight: 2 },
]

/**
 * Generates chord progressions in a key by picking one of the popular progressions.
 */
export class ChordProgressionGenerator {
  #randomGenerator
  #randomizer

  /**
   * Creates a chord progression generator.
   *
   * @param {RandomGenerator} randomGenerator - Seeded random number generator from Dice-RNG-Toolkit.
   * @param {Randomizer} randomizer - Picks weighted random items, from Dice-RNG-Toolkit
   */
  constructor(randomGenerator, randomizer) {
    this.#randomGenerator = randomGenerator
    this.#randomizer = randomizer
  }

  /**
   * Generates a chord progression in the key of the given scale.
   *
   * @param {Scale} scale - The key to generate in. Must have seven notes.
   * @returns {Chord[]} The chords of the progression, in playing order.
   */
  generate(scale) {
    const chordsInKey = scale.chords
    const progression = this.#pickProgression()

    return progression.degrees.map((degree) => chordsInKey[degree])
  }

  /**
   * Picks one of the popular progressions, weighted by how common it is.
   *
   * @returns {{ degrees: number[], weight: number }} The picked progression.
   */
  #pickProgression() {
    const weights = POPULAR_PROGRESSIONS.map((progression) => progression.weight)

    return this.#randomizer.pickWeighted(POPULAR_PROGRESSIONS, weights, this.#randomGenerator)
  }
}
