const fs = require('fs'),
    process = require('process'),
    path = require('path');
let testingOpts = require(path.resolve(__dirname, 'options.js'));

const Helper = {
    shotNameForTest: function(testName) {
        var process = require('process');
        var file = testName;
        var envName = process.env.TESTING_ENV;
        file = file.replace(/[\s\\\/]/g, '_');

        var name = envName + '_' +file;


        if(testingOpts.hasOwnProperty('browserOptions') && testingOpts.browserOptions.hasOwnProperty('type')){
            name += '_' + testingOpts.browserOptions.type;
        }

        if(testingOpts.hasOwnProperty('browserOptions') && testingOpts.browserOptions.hasOwnProperty('size') && testingOpts.browserOptions.size.hasOwnProperty('width')){
            name += '_' + testingOpts.browserOptions.size.width;
        }

        if(testingOpts.hasOwnProperty('browserOptions') && testingOpts.browserOptions.hasOwnProperty('size') && testingOpts.browserOptions.size.hasOwnProperty('height')){
            name += '_' + testingOpts.browserOptions.size.height;
        }
        name += '.png';
        return name;
    }
};
exports = module.exports = Helper;