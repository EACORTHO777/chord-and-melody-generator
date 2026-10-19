const STORAGE_KEY = 'chord-and-melody-generator.favorites'

/**
 * Saves the user's favorite songs in the browser, so they are still there next time.
 * Only the key and the seed are stored, since they are enough to recreate a song.
 */
export class FavoriteStorage {
  #storage

  /**
   * Creates a favorites storage
   *
   * @param {Storage} storage - Where the favorites are stored, usually the browser's localStorage.
   */
  constructor(storage) {
    this.#storage = storage
  }

  /**
   * All saved favorites, oldest first.
   *
   * @type {Array<{ rootNote: string, scaleType: string, seed: number}>}
   */
  get all() {
    try {
      return JSON.parse(this.#storage.getItem(STORAGE_KEY)) ?? []
    } catch {
      return []
    }
  }

  /**
   * Saves a song as a favorite.
   *
   * @param {{ rootNote: string, scaleType: string, seed: number }} songSettings - The key and seed of the song.
   */
  add(songSettings) {
    this.#storage.setItem(STORAGE_KEY, JSON.stringify([...this.all, songSettings]))
  }
}
