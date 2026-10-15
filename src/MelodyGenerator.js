/** @typedef {import('dice-rng-toolkit').RandomGenerator} RandomGenerator */
/** @typedef {import('dice-rng-toolkit').Randomizer} Randomizer */
/** @typedef {import('music-theory-toolkit').Scale} Scale */
/** @typedef {import('music-theory-toolkit').Chord} Chord */
/** @typedef {import('music-theory-toolkit').Note} Note */

/**
 * How many melody notes are played over each chord.
 */
const NOTES_PER_CHORD = 4

/**
 * Notes that belong to the current chord are picked more often than other notes in the scale,
 * so that the melody fits over the chords.
 */
const CHORD_TONE_WEIGHT = 3
const PASSING_TONE_WEIGHT = 1

/**
 * Generates melodies that fit a chord progression.
 */
export class MelodyGenerator {
  #randomGenerator
  #randomizer

  /**
   * Creates a melody generator
   *
   * @param {RandomGenerator} randomGenerator - Seeded random number generator from Dice-RNG-Toolkit.
   * @param {Randomizer} randomizer - Picks weighted random items, from Dice-RNG-Toolkit.
   */
  constructor(randomGenerator, randomizer) {
    this.#randomGenerator = randomGenerator
    this.#randomizer = randomizer
  }

  /**
   * Generates a melody that fits the given chord progression.
   *
   * @param {Scale} scale - The key of the melody.
   * @param {Chord[]} chords - The chord progression to play the melody over
   * @returns {Note[]} The melody notes, in playing order.
   */
  generate(scale, chords) {
    return chords.flatMap((chord) => this.#generateNotesOver(chord, scale))
  }

  /**
   * Generates the melody notes for one chord.
   *
   * @param {Chord} chord - The chord the notes are played over.
   * @param {Scale} scale - The key of the melody.
   * @returns {Note[]} The melody notes for this chord.
   */
  #generateNotesOver(chord, scale) {
    const notesInKey = scale.notes
    const weights = notesInKey.map((note) => this.#weightOf(note, chord))
    const melodyNotes = []

    for (let i = 0; i < NOTES_PER_CHORD; i++) {
      melodyNotes.push(this.#randomizer.pickWeighted(notesInKey, weights, this.#randomGenerator))
    }
    return melodyNotes
  }

  /**
   * Returns how likely a note is to be picked over a chord.
   *
   * @param {Note} note - A note in the key.
   * @param {Chord} chord - The current chord.
   * @returns {number} The weight of the note
   */
  #weightOf(note, chord) {
    return chord.contains(note) ? CHORD_TONE_WEIGHT : PASSING_TONE_WEIGHT
  }
}
