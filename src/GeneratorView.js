/** @typedef {import('music-theory-toolkit').Chord} Chord */
/** @typedef {import('music-theory-toolkit').Note} Note */

/**
 * Handles the page elements of the generator: reads the chosen key and shows the results.
 */
export class GeneratorView {
  #rootNoteSelect
  #scaleTypeSelect
  #generateButton
  #playButton
  #chordsOutput
  #melodyOutput

  /**
   * Finds the generator's elements on the page.
   *
   * @param {Document} document - The page that contains the generator.
   */
  constructor(document) {
    this.#rootNoteSelect = document.querySelector('#root-note')
    this.#scaleTypeSelect = document.querySelector('#scale-type')
    this.#generateButton = document.querySelector('#generate-button')
    this.#playButton = document.querySelector('#play-button')
    this.#chordsOutput = document.querySelector('#chords-output')
    this.#melodyOutput = document.querySelector('#melody-output')
  }

  /**
   * The root note the user has chosen, e.g. "C#".
   *
   * @type {string}
   */
  get selectedRootNote() {
    return this.#rootNoteSelect.value
  }

  /**
   * The scale type the user has chosen, "major" or "minor".
   *
   * @type {string}
   */
  get selectedScaleType() {
    return this.#scaleTypeSelect.value
  }

  /**
   * Calls the handler when the user presses Generate.
   *
   * @param {() => void} handler - The function to call.
   */
  onGenerate(handler) {
    this.#generateButton.addEventListener('click', handler)
  }

  /**
   * Calls the handler when the user presses Play.
   *
   * @param {() => void} handler - The function to call.
   */
  onPlay(handler) {
    this.#playButton.addEventListener('click', handler)
  }

  /**
   * Shows a generated song and enables the Play button.
   *
   * @param {Chord[]} chords - The chord progression.
   * @param {Note[]} melody - The melody.
   */
  showSong(chords, melody) {
    this.#chordsOutput.textContent = chords.map((chord) => chord.toString()).join(' | ')
    this.#melodyOutput.textContent = melody.map((note) => note.toString()).join(' ')
    this.#playButton.disabled = false
  }
}
