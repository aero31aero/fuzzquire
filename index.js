var projectroot = require('project-root-path');
var walkSync = require('walk-sync');

var isMatch = function(path, trypath){
    var counter = 0;
    var pathparts = path.split('/');
    var tryparts = trypath.split('/');
    for(j=0;j<tryparts.length; j++){
        var elem1 = tryparts[j];
        var index = pathparts.indexOf(elem1);
        if (! (index >= counter)) return false;
    }
    return true;
}

var fuzzquire = function(path, logging = false){
    var module = null;
    var paths = walkSync(projectroot, { 
        globs: ['**/*.js'],
        ignore: ['.git', 'node_modules'],
    });
    var modulepath = false;
    var elem = null;
    if(!path.endsWith('.js')) path +='.js';
    for(i=0;i<paths.length;i++){
        elem = paths[i];
        var checkpath = elem
        if(logging) console.log("Fuzzquire: Traversing:",elem);
        if(elem.endsWith('/index.js')) {
            checkpath = elem.replace('/index.js', '.js');
        }
        if(isMatch(checkpath, path)){
            if(logging) console.log("Fuzzquire: Found:",elem)
            if(!modulepath){
                modulepath = elem;
            }
            else {
                throw new Error('Fuzzquire: Ambiguous Module Path: ' + path);
            }
        }
    }
    try {
        if(logging) console.log("Fuzzquire: Loading:",projectroot + "/" + modulepath);
        module = require(projectroot + "/" + modulepath);
        return module;
    }
    catch(e) {
        throw e;
    }
}

module.exports = fuzzquire;
