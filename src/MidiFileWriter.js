/** @typedef {import('music-theory-toolkit').Chord} Chord */
/** @typedef {import('music-theory-toolkit').Note} Note */
/** @typedef {{ tick: number, bytes: number[] }} MidiEvent */

const TICKS_PER_QUARTER_NOTE = 480
const TICKS_PER_CHORD = TICKS_PER_QUARTER_NOTE * 4
const NOTE_ON = 0x90
const NOTE_OFF = 0x80
const VELOCITY = 80
const END_OF_TRACK = [0x00, 0xff, 0x2f, 0x00]

/**
 * Creates standard MIDI files fro m a chord progression and a melody.
 */
export class MidiFileWriter {
  /**
   * Creates a MIDI file where each chord lasts one bar and the melody is spread evenly over the chords.
   *
   * @param {Chord[]} chords - The chord progression.
   * @param {Note[]} melody - The melody.
   * @returns {Uint8Array} The bytes of the MIDI file.
   */
  createFile(chords, melody) {
    const events = [...this.#chordEvents(chords), ...this.#melodyEvents(melody, chords.length)]
    const trackData = [...this.#toTrackBytes(events), ...END_OF_TRACK]

    return new Uint8Array([...this.#headerChunk(), ...this.#trackChunk(trackData)])
  }

  /**
   * Creates the events for the chords, one octave down so the melody is heard on top.
   *
   * @param {Chord[]} chords - The chord progression.
   * @returns {MidiEvent[]} The events of all chord notes.
   */
  #chordEvents(chords) {
    return chords.flatMap((chord, index) =>
      chord.transpose(-12).notes.flatMap((note) => this.#noteEvents(note, index * TICKS_PER_CHORD, TICKS_PER_CHORD)),
    )
  }

  /**
   * Creates the events for the melody.
   *
   * @param {Note[]} melody - The melody.
   * @param {number} chordCount - How many chords the melody is spread over.
   * @returns {MidiEvent[]} The events of all melody notes.
   */
  #melodyEvents(melody, chordCount) {
    const ticksPerNote = Math.round((chordCount * TICKS_PER_CHORD) / melody.length)

    return melody.flatMap((note, index) => this.#noteEvents(note, index * ticksPerNote, ticksPerNote))
  }

  /**
   * Creates the start and stop events for one note.
   *
   * @param {Note} note - The note.
   * @param {number} startTick - When the note starts.
   * @param {number} durationTicks - How long the note lasts.
   * @returns {MidiEvent[]} A note on and a note off event.
   */
  #noteEvents(note, startTick, durationTicks) {
    return [
      { tick: startTick, bytes: [NOTE_ON, note.midiNumber, VELOCITY] },
      { tick: startTick + durationTicks, bytes: [NOTE_OFF, note.midiNumber, 0] },
    ]
  }

  /**
   * Sorts the events by time and turns them into track bytes, where each event starts with the time since the previous one.
   *
   * @param {MidiEvent[]} events - The events in any order.
   * @returns {number[]} The bytes of the track's events.
   */
  #toTrackBytes(events) {
    const sortedEvents = [...events].sort((a, b) => a.tick - b.tick || a.bytes[0] - b.bytes[0])
    let previousTick = 0

    return sortedEvents.flatMap((event) => {
      const deltaTime = event.tick - previousTick
      previousTick = event.tick
      return [...this.#variableLengthBytes(deltaTime), ...event.bytes]
    })
  }

  /**
   * Writes a number in MIDI's variable length format: 7 bits per byte, where the highest bit means "more bytes follow".
   *
   * @param {number} value - The number to write.
   * @returns {number[]} The bytes of the number.
   */
  #variableLengthBytes(value) {
    const bytes = [value & 0x7f]
    let remaining = value >> 7

    while (remaining > 0) {
      bytes.unshift((remaining & 0x7f) | 0x80)
      remaining >>= 7
    }
    return bytes
  }

  /**
   * Creates the file header: one track, with the time resolution in ticks per quarter note.
   *
   * @returns {number[]} The bytes of the header.
   */
  #headerChunk() {
    const lengthOfHeader = 6
    const singleTrackFormat = [0, 0]
    const numberOfTracks = [0, 1]
    return [
      ...this.#textBytes('MThd'),
      ...this.#uint32Bytes(lengthOfHeader),
      ...singleTrackFormat,
      ...numberOfTracks,
      ...this.#uint16bytes(TICKS_PER_QUARTER_NOTE),
    ]
  }

  /**
   * Wraps the track data in a track chunk.
   *
   * @param {number[]} trackData - The bytes of the track's events.
   * @returns {number[]} The bytes of the track chunk.
   */
  #trackChunk(trackData) {
    return [...this.#textBytes('MTrk'), ...this.#uint32Bytes(trackData.length), ...trackData]
  }

  /**
   * Turns a text into one byte per character.
   *
   * @param {string} text - The text, e.g. "MThd".
   * @returns {number[]} The character codes.
   */
  #textBytes(text) {
    return [...text].map((character) => character.charCodeAt(0))
  }

  /**
   * Writes a number as two bytes, most significant first.
   *
   * @param {number} value - The number to write.
   * @returns {number[]} Two bytes.
   */
  #uint16bytes(value) {
    return [(value >> 8) & 0xff, value & 0xff]
  }

  /**
   * Writes a number as four bytes, most significant first.
   *
   * @param {number} value - The number to write.
   * @returns {number[]} Four bytes.
   */
  #uint32Bytes(value) {
    return [(value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]
  }
}
