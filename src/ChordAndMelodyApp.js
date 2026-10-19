import { Note, Scale } from 'music-theory-toolkit'

/** @typedef {import('./GeneratorView.js').GeneratorView} GeneratorView */
/** @typedef {import('./SongGenerator.js').SongGenerator} SongGenerator */
/** @typedef {import('./AudioPlayer.js').AudioPlayer} AudioPlayer */
/** @typedef {import('./ShareLink.js').ShareLink} ShareLink */

/**
 * Connects the page to the song generator, the audio player and share links.
 */
export class ChordAndMelodyApp {
  #view
  #songGenerator
  #audioPlayer
  #shareLink
  #songSettings = { rootNote: '', scaleTypes: '', seed: 0 }
  #song = { chords: [], melody: [] }

  /**
   * Creates the app from its parts.
   *
   * @param {GeneratorView} view - The page elements.
   * @param {SongGenerator} songGenerator - Generates songs from a seed.
   * @param {AudioPlayer} audioPlayer - Plays the generated song.
   * @param {ShareLink} shareLink - Creates and reads share links.
   */
  constructor(view, songGenerator, audioPlayer, shareLink) {
    this.#view = view
    this.#songGenerator = songGenerator
    this.#audioPlayer = audioPlayer
    this.#shareLink = shareLink
  }

  /**
   * Starts listening to the user's actions and opens a shared song if the address contains one.
   */
  start() {
    this.#view.onGenerate(() => this.#showSong(this.#songGenerator.nextSeed()))
    this.#view.onPlay(() => this.#audioPlayer.playSong(this.#song.chords, this.#song.melody))
    this.#view.onShare(() => this.#shareSong())

    if (this.#shareLink.hasSharedSong()) {
      this.#openSharedSong()
    }
  }

  /**
   * Selects the key for the shared link and shows its song.
   */
  #openSharedSong() {
    const { rootNote, scaleType, seed } = this.#shareLink.sharedSong

    this.#view.selectKey(rootNote, scaleType)
    this.#showSong(seed)
  }

  /**
   * Generates the song for a seed in the chosen key and shows it.
   *
   * @param {number} seed - Decides which song i generated.
   */
  #showSong(seed) {
    const scale = this.#selectedScale()

    this.#songSettings = { rootNote: this.#view.selectedRootNote, scaleType: this.#view.selectedScaleType, seed }
    this.#song = this.#songGenerator.generate(scale, seed)

    this.#view.showKey(scale.notes, scale.relative().toString(), (note) => this.#audioPlayer.playNote(note))
    this.#view.showSong(this.#song.chords, this.#song.melody, (chord) => this.audioPLayer.playChord(chord))
  }

  /**
   * Creates a link to the current song and shows it.
   */
  #shareSong() {
    const { rootNote, scaleType, seed } = this.#songSettings

    this.#view.showShareLink(this.#shareLink.create(rootNote, scaleType, seed))
  }

  /**
   * Creates the scale the user has chosen, in octave 4.
   *
   * @returns {Scale} The chosen scale
   */
  #selectedScale() {
    const rootNote = new Note(`${this.#view.selectedRootNote}4`)

    return new Scale(rootNote, this.#view.selectedScaleType)
  }
}
