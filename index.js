/**
 * Module dependencies.
 */
const fs = require('fs');
const path = require('path');

/**
 * Export.
 */
module.exports = PrefsFactory;

/**
 * Main constructor, requires a path where a `/config` directory
 * will be created, to contain the preference files.
 * 
 * @param {String} configPath 
 * @constructor
 */
function Prefs(configPath) {
    if (typeof configPath !== 'string')
        throw new TypeError('Please provide a string path for the config directory');

    const configDir = path.join(configPath, 'config');

    // Creating the config directory if it does not exist.
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }

    // Store the necessary paths.
    const PREFERENCES_PATH = path.join(configPath, 'config', 'preferences.json');
    const BACKUP_PATH = path.join(configPath, 'config', 'preferences-backup.json');

    /**
     * Reads a preference file. It can be either the main `preferences.json` file, or
     * the `preferences-backup.json` used for backup.
     * 
     * If the file exists, it is processed further, else it is created anew.
     * 
     * @param {String} path 
     * @api private
     */
    function read(path = PREFERENCES_PATH) {
        if (fs.existsSync(path)) {
            return parse(path);
        } else {
            return recreate(path);
        }
    }

    /**
     * Parses a preference file. It can be either the main `preferences.json` file, or
     * the `preferences-backup.json` used for backup.
     * 
     * If the file is in valid `JSON` format, it is parsed and returned.
     * 
     * If `preferences.json` is invalid, its content is replaced by `preferences-backup.json`.
     * 
     * If `preferences-backup.json` is invalid, then it is created anew.
     * 
     * @param {String} path 
     * @api private
     */
    function parse(path) {
        const prefs = fs.readFileSync(path);
        try {
            return JSON.parse(prefs);
        } catch (err) {
            if (path === PREFERENCES_PATH)
                return restoreBackup();
            else if (path === BACKUP_PATH)
                return recreate(path);
        }
    }

    /**
     * Reads `preferences-backup.json` and writes its content into `preferences.json`.
     * 
     * @api private
     */
    function restoreBackup() {
        const backup = read(BACKUP_PATH);
        return write(PREFERENCES_PATH, backup);
    }

    /**
     * Writes an empty object to the specified preference file.
     * 
     * @param {String} path 
     * @api private
     */
    function recreate(path) {
        return write(path, {});
    }

    /**
     * Writes an object to the specified preference file.
     * 
     * @param {String} path 
     * @param {Object} content 
     * @api private
     */
    function write(path, content) {
        if (content.constructor !== Object) return;

        fs.writeFileSync(path, JSON.stringify(content, null, 2));
        return content;
    }

    /**
     * Writes an object to both files: `preferences.json` and `preferences-backup.json`.
     * 
     * @param {String} content 
     * @api private
     */
    function save(content) {
        write(BACKUP_PATH, content);
        write(PREFERENCES_PATH, content);
    }

    /**
     * Load the main preference file: `preferences.json`.
     * 
     * @api public
     */
    this.load = function () {
        console.log(PREFERENCES_PATH);
        console.log(BACKUP_PATH);
        return read(PREFERENCES_PATH);
    }.bind(this);

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
    this.add = function (newPrefs = {}) {
        if (newPrefs.constructor !== Object) return;

        const oldPrefs = read(PREFERENCES_PATH);
        const prefs = Object.assign(oldPrefs, newPrefs);
        save(prefs);
    }.bind(this);

    /**
     * Remove an entry from the main preference file.
     * 
     * All changes are also mirrored in the backup file.
     * 
     * @param {String} key 
     * @api public
     */
    this.remove = function (key) {
        if (typeof key !== 'string') return;

        const prefs = read(PREFERENCES_PATH);
        delete prefs[key];
        save(prefs);
    }.bind(this);

    /**
     * Clear the main preference file.
     * 
     * All changes are also mirrored in the backup file.
     * 
     * @api public
     */
    this.clear = function () {
        save({});
    }.bind(this);
};

function PrefsFactory(stringPath) {
    return new Prefs(stringPath);
}
