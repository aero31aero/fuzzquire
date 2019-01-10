var projectroot = require('project-root-path');
var walkSync = require('walk-sync');
var Path = require('path');

var isMatch = function(path, trypath){
    var counter = 0;
    var pathparts = path.split('/');
    var tryparts = trypath.split('/');
    for (j=0; j<tryparts.length; j++) {
        var elem1 = tryparts[j];
        var index = pathparts.indexOf(elem1);
        if (! (index >= counter)) return false;
    }
    return true;
}

var logging = false; // default

var getPathIfMatches = function (checkpath, path, modulepath, elem) {
    if(logging) console.log("Fuzzquire: Searching for:", path);
    if(isMatch(checkpath, path)){
        if(logging) console.log("Fuzzquire: Found:", elem);
        if(!modulepath){
            modulepath = elem;
        }
        else {
            throw new Error('Fuzzquire: Ambiguous Module Path: ' + path);
        }
    }
    return modulepath;
}

var paths = [];
var exts = ['.js', '.json'];

var loader = function(projectroot, enable_logging = false) {
    logging = enable_logging;
    if (!process.env.FUZZQUIRE_DATA) {
        if(logging) console.log("Fuzzquire: Reading paths into memory.");
        paths = walkSync(projectroot, {
            globs: ['**/*.js', '**/*.json'],
            ignore: ['.git', 'node_modules'],
        });
        process.env.FUZZQUIRE_DATA = JSON.stringify(paths);
    } else {
        if(logging) console.log("Fuzzquire: Paths already in memory.");
        paths = JSON.parse(process.env.FUZZQUIRE_DATA);
    }
}

var fuzzquire = function(path, logging = false){
    var module = null;
    loader(projectroot, logging);
    var modulepath = false;
    var elem = null;
    const loopoverext = Path.extname(path) == '' ? true : false;
    for(i=0;i<paths.length;i++){
        elem = paths[i];
        var checkpath = elem;
        if(logging) console.log("Fuzzquire: Traversing:",elem);
        if(elem.endsWith('/index.js')) {
            checkpath = elem.replace('/index.js', '.js');
        }
        if (loopoverext) {
            exts.forEach((ext) => {
                modulepath = getPathIfMatches(checkpath, path + ext, modulepath, elem);
            });
        } else {
            modulepath = getPathIfMatches(checkpath, path, modulepath, elem);
        }

    }
    try {
        if (!modulepath) {
            throw new Error('Fuzzquire: Couldn\'t find specified module.');
        }
        if (logging) console.log("Fuzzquire: Loading:", projectroot + "/" + modulepath);
        module = require(projectroot + "/" + modulepath);
        return module;
    }
    catch(e) {
        throw e;
    }
}

module.exports = fuzzquire;
