var projectroot = require('project-root-path');
var walkSync = require('walk-sync');

var fuzzquire = function(path){
    var module = null;
    var error = new Error('Module not found');
    var paths = walkSync(projectroot, { 
        globs: ['**/*.js'],
        ignore: ['.git', 'node_modules'],
    });
    var elem = null;
    if(!path.endsWith('.js')) path +='.js';
    for(i=0;i<paths.length;i++){
        elem = paths[i];
        // console.log("Itering:", elem);
        if(elem.endsWith(path)){
            // console.log("Trying to import");
            try {
                module = require(projectroot + "/" + elem);
                // console.log(projectroot + "/" + elem)
                return module;
            }
            catch(e) {
                // console.log("Failed")
                // error = e;
                // Ignore module import errors
            }
        }
    }
    throw error;

}

module.exports = fuzzquire;