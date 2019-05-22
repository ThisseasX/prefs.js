/**
 * Load the main preference file: `preferences.json`.
 *
 * @api public
 */
declare function load(): Object;

/**
 * Writes an object to the main preference file, extending its properties, and replacing existing ones.
 *
 * All changes are also mirrored in the backup file.
 *
 * @example
 *
 * // Existing
 * {
 *   "a": 1,
 *   "b": 2
 * }
 *
 * // Added
 * {
 *   "b": 0,
 *   "c": 3
 * }
 *
 * // Resulting
 * {
 *   "a": 1,
 *   "b": 0,
 *   "c": 3
 * }
 *
 * @param {Object} newPrefs
 * @api public
 */
declare function add(newPrefs?: Object): void;

/**
 * Remove an entry from the main preference file.
 *
 * All changes are also mirrored in the backup file.
 *
 * @param {String} key
 * @api public
 */
declare function remove(key: string): void;

/**
 * Clear the main preference file.
 *
 * All changes are also mirrored in the backup file.
 *
 * @api public
 */
declare function clear(): void;
