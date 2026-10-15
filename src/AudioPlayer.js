/** @typedef {import('music-theory-toolkit').Note} Note */
/** @typedef {import('music-theory-toolkit').Chord} Chord */

const CHORD_DURATION_SECONDS = 1.6
const NOTE_DURATION_SECONDS = 0.4
const VOLUME = 0.15
const SILENT_VOLUME = 0.001
const START_DELAY_SECONDS = 0.05

/**
 * Play notes, chords and melodies in the browser with the Web Audio API.
 */
export class AudioPlayer {
  #audioContext

  /**
   * Creates an audio player.
   *
   * @param {AudioContext} audioContext - The browser's audio context that the sound is played through.
   */
  constructor(audioContext) {
    this.#audioContext = audioContext
  }

  /**
   * Plays a single note.
   *
   * @param {Note} note - The note to play.
   */
  playNote(note) {
    this.#playTone(note.frequency, this.#startPlayback(), NOTE_DURATION_SECONDS)
  }

  /**
   * Plays all notes of a chord at the same time.
   *
   * @param {Chord} chord - The chord to play.
   */
  playChord(chord) {
    this.#playChordAt(chord, this.#startPlayback())
  }

  /**
   * Plays a chord progression with a melody on top.
   *
   * @param {Chord[]} chords - The chord progression.
   * @param {Note[]} melody - The melody, spread evenly over the chords.
   */
  playSong(chords, melody) {
    const startTime = this.#startPlayback()
    const melodyNoteDuration = (chords.length * CHORD_DURATION_SECONDS) / melody.length

    chords.forEach((chord, index) => {
      this.#playChordAt(chord.transpose(-12), startTime + index * CHORD_DURATION_SECONDS)
    })
    melody.forEach((note, index) => {
      this.#playTone(note.frequency, startTime + index * melodyNoteDuration, melodyNoteDuration)
    })
  }

  /**
   * Plays all notes of a chord at a given time.
   *
   * @param {Chord} chord - The chord to play
   * @param {number} startTime - When the chord starts, in audio context time.
   */
  #playChordAt(chord, startTime) {
    for (const note of chord.notes) {
      this.#playTone(note.frequency, startTime, CHORD_DURATION_SECONDS)
    }
  }

  /**
   * Wakes up the audio conext and returns when the sound can start.
   *
   * @returns {number} The start time, in audio context time.
   */
  #startPlayback() {
    this.#audioContext.resume()
    return this.#audioContext.currentTime + START_DELAY_SECONDS
  }

  /**
   * Plays one tone that fades out.
   *
   * @param {number} frequency - The frequency of the tone in hertz.
   * @param {number} startTime - When the tone starts, in audio context time.
   * @param {number} duration - How long the tone lasts, in seconds.
   */
  #playTone(frequency, startTime, duration) {
    const oscillator = this.#audioContext.createOscillator()
    const volume = this.#audioContext.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.value = frequency
    volume.gain.setValueAtTime(VOLUME, startTime)
    volume.gain.exponentialRampToValueAtTime(SILENT_VOLUME, startTime + duration)

    oscillator.connect(volume).connect(this.#audioContext.destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  }
}
