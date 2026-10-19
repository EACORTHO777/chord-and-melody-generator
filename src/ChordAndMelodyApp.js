import { Note, Scale } from 'music-theory-toolkit'

/** @typedef {import('./GeneratorView.js').GeneratorView} GeneratorView */
/** @typedef {import('./ChordProgressionGenerator.js').ChordProgressionGenerator} ChordProgressionGenerator */
/** @typedef {import('./MelodyGenerator.js').MelodyGenerator} MelodyGenerator */
/** @typedef {import('./AudioPlayer.js').AudioPlayer} AudioPlayer */

/**
 * Connects the page to the generators and the audio player.
 */
export class ChordAndMelodyApp {
  #view
  #chordProgressionGenerator
  #melodyGenerator
  #audioPlayer
  #chords = []
  #melody = []

  /**
   * Creates the app from its parts.
   *
   * @param {GeneratorView} view - The page elements.
   * @param {ChordProgressionGenerator} chordProgressionGenerator - Generates chord progressions.
   * @param {MelodyGenerator} melodyGenerator - Generates melodies.
   * @param {AudioPlayer} audioPlayer - Plays the generated song.
   */
  constructor(view, chordProgressionGenerator, melodyGenerator, audioPlayer) {
    this.#view = view
    this.#chordProgressionGenerator = chordProgressionGenerator
    this.#melodyGenerator = melodyGenerator
    this.#audioPlayer = audioPlayer
  }

  /**
   * Starts listening to the user's actions.
   */
  start() {
    this.#view.onGenerate(() => this.#generateSong())
    this.#view.onPlay(() => this.#playSong())
  }

  /**
   * Generates a new chord progression and melody in the chosen key and shows them.
   */
  #generateSong() {
    const scale = this.#selectedScale()

    this.#chords = this.#chordProgressionGenerator.generate(scale)
    this.#melody = this.#melodyGenerator.generate(scale, this.#chords)
    this.#view.showSong(this.#chords, this.#melody)
  }

  /**
   * Plays the current chord progression and melody.
   */
  #playSong() {
    this.#audioPlayer.playSong(this.#chords, this.#melody)
  }

  /**
   * Creates the scale the user has chosen, in octave 4.
   *
   * @returns {Scale} The chosen scale.
   */
  #selectedScale() {
    const rootNote = new Note(`${this.#view.selectedRootNote}4`)

    return new Scale(rootNote, this.#view.selectedScaleType)
  }
}
