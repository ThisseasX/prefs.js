# Prefs.js
An easy-to-use library providing a simple interface for saving and retrieving key-value pairs in JSON format.


## Installation
    $ npm install prefs
    
## Usage
```js
const { load, add, remove, clear } = require('prefs')(configFolderPath);
```

The `configFolderPath` is the path where a `/config` directory will be created, containing the preference files.

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
