# Fuzzquire

Easier in-project module loading for cleaner and more readable code.

Fuzzquire is a wrapper around require. You only need to specify the minimum number of file path parts and the file name to load the file in your project, and thus, you increase the code readability as well as reduce the cognitive load on yourself while coding as you do not have to remember the relative file paths anymore. Bliss!

Try it out: `npm install fuzzquire --save`.

## Example

Let's take a directory structure like:

```
project-folder
├── app.js
├── package.json
├── routes
│   ├── api
│   │   ├── index.js
│   │   ├── notify.js
│   │   ├── services
│   │   │   ├── events.js
│   │   │   └── users.js
│   │   └── typeahead.js
│   ├── auth.js
│   ├── components
│   │   ├── custom
│   │   │   └── pybits.js
│   │   ├── custom.js
│   │   ├── dashboard.js
│   │   ├── index.js
│   │   ├── login.js
│   │   └── portals.js
│   ├── export.js
│   ├── index.js
│   ├── transaction.js
│   └── upload.js
├── utils
│   ├── authentication.js
│   ├── config-loader.js
│   ├── service.constructor.js
│   └── state.js
```

Now, this is what some file would look before `fuzzquire`:

```js
const Users = require('../api/services/users');
const auth = require('../../utils/authentication');
const config = require('../../utils/config-loader');
const pybits = require('./custom/pybits');
const app = require('../../app').express;
...
```

And this would be the same file after `fuzzquire`:

```js
const fq = require('fuzzquire');
const Users = fq('api/users');
const auth = fq('authentication');
const config = fq('config-loader');
const pybits = fq('pybits');
const app = fq('app').express;
```

## Contributing

Contributions are welcomed. If you want a feature or find a bug, please open an issue and I'll try to resolve it quickly.
