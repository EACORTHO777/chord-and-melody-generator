import { Note, Scale } from 'music-theory-toolkit'

/** @typedef {import('./GeneratorView.js').GeneratorView} GeneratorView */
/** @typedef {import('./SongGenerator.js').SongGenerator} SongGenerator */
/** @typedef {import('./AudioPlayer.js').AudioPlayer} AudioPlayer */
/** @typedef {import('./ShareLink.js').ShareLink} ShareLink */
/** @typedef {import('./FavoriteStorage.js').FavoriteStorage} FavoriteStorage */
/** @typedef {{ rootNote: string, scaleType: string, seed: number }} SongSettings */

/**
 * Connects the page to the song generator, the audio player, share links and favorites.
 */
export class ChordAndMelodyApp {
  #view
  #songGenerator
  #audioPlayer
  #shareLink
  #favoriteStorage
  #songSettings = { rootNote: '', scaleType: '', seed: 0 }
  #song = { chords: [], melody: [] }

  /**
   * Creates the app from its parts.
   *
   * @param {object} parts - The parts of the app.
   * @param {GeneratorView} parts.view - The page elements.
   * @param {SongGenerator} parts.songGenerator - Generates songs from a seed.
   * @param {AudioPlayer} parts.audioPlayer - Plays the generated song.
   * @param {ShareLink} parts.shareLink - Creates and reads share links.
   * @param {FavoriteStorage} parts.favoriteStorage - Saves favorite songs.
   */
  constructor({ view, songGenerator, audioPlayer, shareLink, favoriteStorage }) {
    this.#view = view
    this.#songGenerator = songGenerator
    this.#audioPlayer = audioPlayer
    this.#shareLink = shareLink
    this.#favoriteStorage = favoriteStorage
  }

  /**
   * Starts listening to the user's actions, shows saved favorites and opens a shared song if there is one.
   */
  start() {
    this.#view.onGenerate(() => this.#showSong(this.#songGenerator.nextSeed()))
    this.#view.onPlay(() => this.#audioPlayer.playSong(this.#song.chords, this.#song.melody))
    this.#view.onShare(() => this.#shareSong())
    this.#view.onSaveFavorite(() => this.#saveFavorite())
    this.#showFavorites()

    if (this.#shareLink.hasSharedSong()) {
      this.#openSong(this.#shareLink.sharedSong)
    }
  }

  /**
   * Selects the key of a saved or shared song and shows the song.
   *
   * @param {SongSettings} songSettings - The key and seed of the song.
   */
  #openSong({ rootNote, scaleType, seed }) {
    this.#view.selectKey(rootNote, scaleType)
    this.#showSong(seed)
  }

  /**
   * Generates the song for a seed in the chosen key and shows it.
   *
   * @param {number} seed - Decides which song is generated.
   */
  #showSong(seed) {
    const scale = this.#selectedScale()

    this.#songSettings = { rootNote: this.#view.selectedRootNote, scaleType: this.#view.selectedScaleType, seed }
    this.#song = this.#songGenerator.generate(scale, seed)

    this.#view.showKey(scale.notes, scale.relative().toString(), (note) => this.#audioPlayer.playNote(note))
    this.#view.showSong(this.#song.chords, this.#song.melody, (chord) => this.#audioPlayer.playChord(chord))
  }

  /**
   * Creates a link to the current song and shows it.
   */
  #shareSong() {
    const { rootNote, scaleType, seed } = this.#songSettings

    this.#view.showShareLink(this.#shareLink.create(rootNote, scaleType, seed))
  }

  /**
   * Saves the current song as a favorite and updates the list.
   */
  #saveFavorite() {
    this.#favoriteStorage.add(this.#songSettings)
    this.#showFavorites()
  }

  /**
   * Shows all saved favorites. Clicking one opens the song again.
   */
  #showFavorites() {
    this.#view.showFavorites(this.#favoriteStorage.all, (favorite) => this.#openSong(favorite))
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
