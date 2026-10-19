/**
 * Creates and reads links that recreate a song: the key and the seed are stored in the address.
 */
export class ShareLink {
  #location

  /**
   * Creates a share link handler.
   *
   * @param {Location} location - The browser's current address.
   */
  constructor(location) {
    this.#location = location
  }

  /**
   * Creates a link to a song.
   *
   * @param {string} rootNote - The root note of the key. e.g. "E".
   * @param {string} scaleType - "major" or "minor".
   * @param {number} seed - The seed of the song.
   * @returns {string} The full link.
   */
  create(rootNote, scaleType, seed) {
    const url = new URL(this.#location.href)
    url.search = new URLSearchParams({ root: rootNote, scale: scaleType, seed: String(seed) }).toString()

    return url.toString()
  }

  /**
   * Checks if the current address contains a shared song.
   *
   * @returns {boolean} True if the address has a seed.
   */
  hasSharedSong() {
    return new URLSearchParams(this.#location.search).has('seed')
  }

  /**
   * The song stored in the current address.
   *
   * @type {{ rootNote: string, scaleType: string, seed: number }}
   */
  get sharedSong() {
    const parameters = new URLSearchParams(this.#location.search)

    return {
      rootNote: parameters.get('root'),
      scaleType: parameters.get('scale'),
      seed: Number(parameters.get('seed')),
    }
  }
}
