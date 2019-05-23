const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { load, add, remove, clear } = require('../index');

const PREFERENCES_PATH = path.join(path.dirname(require.main.filename), 'preferences.json');
const BACKUP_PATH = path.join(path.dirname(require.main.filename), 'preferences-backup.json');

describe('prefs', () => {

    after(() => {
        fs.existsSync(PREFERENCES_PATH) & fs.unlinkSync(PREFERENCES_PATH);
        fs.existsSync(BACKUP_PATH) & fs.unlinkSync(BACKUP_PATH);
    });

    context('#load', () => {

        it('loads the existing preferences', () => {
            clear();

            const input = { a: 1 };
            add(input);

            const prefs = load();
            assert.deepEqual(prefs, input);
        });

        it('creates main preference file', () => {
            fs.existsSync(PREFERENCES_PATH) & fs.unlinkSync(PREFERENCES_PATH);

            load();

            assert.strictEqual(fs.existsSync(PREFERENCES_PATH), true);
        });

        it('restores backup if main file is invalid JSON', () => {
            clear();

            const input = { a: 1 };
            add(input);

            fs.writeFileSync(PREFERENCES_PATH, 'invalid json');

            const prefs = load();
            assert.deepEqual(prefs, input);
        });

        it('recreates main and backup files if both are invalid JSON', () => {
            fs.writeFileSync(PREFERENCES_PATH, 'invalid json');
            fs.writeFileSync(BACKUP_PATH, 'invalid json');
            load();

            const prefs = JSON.parse(fs.readFileSync(PREFERENCES_PATH, 'utf8'));
            const backup = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));

            assert.deepEqual(prefs, {});
            assert.deepEqual(backup, {});
        });
    });

    context('#add', () => {

        it('adds preferences to the main file', () => {
            clear();

            const input = { a: 1 };
            add(input);

            const prefs = load();
            assert.deepEqual(prefs, input);
        });

        it('adds preferences to the backup file', () => {
            clear();

            const input = { a: 1 };
            add(input);

            const prefs = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
            assert.deepEqual(prefs, input);
        });

        it('updates a preference', () => {
            clear();

            add({ a: 1 });

            const input = { a: 2 };
            add(input);

            const prefs = load();
            assert.deepEqual(prefs, input);
        });

        it('creates backup preference file', () => {
            fs.existsSync(BACKUP_PATH) & fs.unlinkSync(BACKUP_PATH);

            add();

            assert.strictEqual(fs.existsSync(BACKUP_PATH), true);
        });
    });

    context('#remove', () => {

        it('removes a preference', () => {
            clear();

            add({ a: 1, b: 2 });
            remove('a');

            const prefs = load();
            assert.deepEqual(prefs, { b: 2 });
        });
    });

    context('#clear', () => {

        it('removes all preferences', () => {
            clear();

            const input = { a: 1 };
            add(input);

            const prefs = load();
            assert.deepEqual(prefs, input);

            clear();

            const prefsCleared = load();
            assert.deepEqual(prefsCleared, {});
        });

        it('creates both files if they do not exist', () => {
            fs.existsSync(PREFERENCES_PATH) & fs.unlinkSync(PREFERENCES_PATH);
            fs.existsSync(BACKUP_PATH) & fs.unlinkSync(BACKUP_PATH);

            clear();

            assert.strictEqual(fs.existsSync(PREFERENCES_PATH), true);
            assert.strictEqual(fs.existsSync(BACKUP_PATH), true);
        });
    });
});