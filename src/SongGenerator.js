/** @typedef {import('dice-rng-toolkit').RandomGenerator} RandomGenerator */
/** @typedef {import('music-theory-toolkit').Scale} Scale */
/** @typedef {import('music-theory-toolkit').Chord} Chord */
/** @typedef {import('music-theory-toolkit').Note} Note */
/** @typedef {import('./ChordProgressionGenerator.js').ChordProgressionGenerator} ChordProgressionGenerator */
/** @typedef {import('./MelodyGenerator.js').MelodyGenerator} MelodyGenerator */

const MAX_SEED = 999999

/**
 * Generates whole songs, a chord progression with a melody, from a seed.
 * The same key and seed always give the same song.
 */
export class SongGenerator {
  #randomGenerator
  #chordProgressionGenerator
  #melodyGenerator

  /**
   * Creates a song generator.
   *
   * @param {RandomGenerator} randomGenerator - Seeded random number generator, shared with the other generators.
   * @param {ChordProgressionGenerator} chordProgressionGenerator - Generates the chords.
   * @param {MelodyGenerator} melodyGenerator - Generates the melody.
   */
  constructor(randomGenerator, chordProgressionGenerator, melodyGenerator) {
    this.#randomGenerator = randomGenerator
    this.#chordProgressionGenerator = chordProgressionGenerator
    this.#melodyGenerator = melodyGenerator
  }
  /**
   * Creates a new random seed for a song
   *
   * @returns {number} A seed between 1 and 999999.
   */
  nextSeed() {
    return this.#randomGenerator.nextInt(1, MAX_SEED)
  }

  /**
   * Generates a song in the given key from a seed.
   *
   * @param {Scale} scale - The key of the song.
   * @param {number} seed - Decides which song is generated.
   * @returns {{ chords: Chord[], melody: Note[] }} The generated song.
   */
  generate(scale, seed) {
    this.#randomGenerator.reset(seed)
    const chords = this.#chordProgressionGenerator.generate(scale)
    const melody = this.#melodyGenerator.generate(scale, chords)

    return { chords, melody }
  }
}
