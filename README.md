# mdlldr

Node module for loading node modules in the browser

## Documentation

### mdlldr(moduleNames, path, overrides, callback)

__Arguments__

* moduleNames - array of modules names
* path - root path of modules
* overrides - object map of module names to override
* callback(error, moduleSrc) - callback function

--Example__

```javascript
var mdlldr = require('mdlldr');

mdlldr(['my-module'], './', { DateZ: 'DateZ' }, function (err, js) {
  //now use js in middleware or write to file or something
});
```

## License
Copyright (c) 2012 August Hovland
Licensed under the MIT license.