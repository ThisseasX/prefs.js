# Prefs.js
An easy-to-use library providing a simple interface for saving and retrieving key-value pairs in JSON format.


## Installation
    $ npm install prefs
    
## Usage
```js
const prefs = require('prefs');
const { load, add, remove, clear } = prefs('./path/to/config');

// or in a shorter way

const { load, add, remove, clear } = require('prefs')('./path/to/config');
```

To start using `prefs`, you need to specify a path where the `/config` directory will be created, containing the preference files.

e.g.
```js
const { load, add, remove, clear } = require('prefs')(__dirname);
```

### Add a preference
```js
add({ name: 'John', surname: 'Doe' });
```

### Load preferences
```js
load(); // => { name: 'John', surname: 'Doe' })
```

### Edit a preference
```js
add({ name: 'Jane' }); // => { name: 'Jane', surname: 'Doe' })
```

### Remove a preference
```js
remove('surname'); // => { name: 'Jane' }
```

### Clear all preferences
```js
clear(); // => {}
```

## License
[MIT](https://github.com/ThisseasX/prefs.js/blob/master/LICENSE)
