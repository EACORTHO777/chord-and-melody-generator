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
  #document
  #relativeKeyOutput
  #scaleNotesOutput
  #shareButton
  #shareOutput

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
    this.#document = document
    this.#relativeKeyOutput = document.querySelector('#relative-key-output')
    this.#scaleNotesOutput = document.querySelector('#scale-notes-output')
    this.#shareButton = document.querySelector('#share-button')
    this.#shareOutput = document.querySelector('#share-output')
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
   * Calls the handler when the user presses Share.
   *
   * @param {() => void} handler - The function to call.
   */
  onShare(handler) {
    this.#shareButton.addEventListener('click', handler)
  }

  /**
   * Selects a key in the dropdowns, e.g. when a shared link is opened.
   *
   * @param {string} rootNote - The root note to select, e.g. "E".
   * @param {string} scaleType - The scale type to select, "major" or "minor".
   */
  selectKey(rootNote, scaleType) {
    this.#rootNoteSelect.value = rootNote
    this.#scaleTypeSelect.vale = scaleType
  }

  /**
   * Shows a share link and copies it to the clipboard.
   *
   * @param {string} link - The link to the song.
   */
  showShareLink(link) {
    navigator.clipboard.writeText(link)
    this.#shareOutput.textContent = `Link copied: ${link}`
  }

  /**
   * Shows the notes of the chosen key and its relative key. Each note is a button that can be played.
   *
   * @param {Note[]} scaleNotes - The notes of the chosen scale.
   * @param {string} relativeKeyName - The name of the relative key, e.g. "A minor".
   * @param {(note: Note) => void} onNoteClick - Called with the note when its button is clicked.
   */
  showKey(scaleNotes, relativeKeyName, onNoteClick) {
    this.#relativeKeyOutput.textContent = `Relative key: ${relativeKeyName}`
    this.#showButtons(this.#scaleNotesOutput, scaleNotes, onNoteClick)
  }

  /**
   * Shows a generated song and enables the Play button. Each chord is a button that can be played.
   *
   * @param {Chord[]} chords - The chord progression.
   * @param {Note[]} melody - The melody.
   * @param {(chord: Chord) => void} onChordClick - Called with the chord when its button is clicked.
   */
  showSong(chords, melody, onChordClick) {
    this.#showButtons(this.#chordsOutput, chords, onChordClick)
    this.#melodyOutput.textContent = melody.map((note) => note.toString()).join(' ')
    this.#playButton.disabled = false
    this.#shareButton.disabled = false
  }

  /**
   * Replaces the content of a container with one button per item.
   *
   * @param {HTMLElement} container - The element to put the buttons in.
   * @param {Array<Note|Chord>} items - The items to show. Their toString() becomes the button text.
   * @param {(item: Note|Chord) => void} onClick - Called with the item when its button is clicked.
   */
  #showButtons(container, items, onClick) {
    const buttons = items.map((item) => {
      const button = this.#document.createElement('button')
      button.textContent = item.toString()
      button.addEventListener('click', () => onClick(item))
      return button
    })
    container.replaceChildren(...buttons)
  }
}
