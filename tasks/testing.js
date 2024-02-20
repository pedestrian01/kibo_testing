'use strict';

const path = require('path'),
    process = require('process'),
    fs = require('fs');

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');



 module.exports = function(grunt) {


    var reporterOptions = function(type) {
        var options = grunt.config.get(['testing', 'reporterOptions', type]) || {};
        
        //Provide default options if none
        if(Object.keys(options).length < 1) {
            options = {dot: '-'};
        }
        
        //Convert custom reporters to local file
        Object.keys(options).forEach(function(key) {
            var newKey = null;
            switch(key) {
                case 'emailReporter': newKey = 'email-reporter'; break;
                case 'csvReporter': newKey = 'csv-reporter'; break;
            }
            if(newKey !== null) {
                newKey = path.resolve(__dirname, 'lib', newKey);
                options[newKey] = options[key];
                delete options[key];
            }
        });
        
        //Allow for email reporting to be overridden specifically by environment variables
        if(!!process.env.EMAIL_REPORTER_TO) {
            options[path.resolve(__dirname, 'lib', 'email-reporter')] = {
                stdout: '-',
                options: {
                    reporterOptions: {
                        emailReporter: {
                            from: process.env.EMAIL_REPORTER_FROM,
                            to: process.env.EMAIL_REPORTER_TO,
                            subject: process.env.EMAIL_REPORTER_SUBJECT
                        }
                    }
                }
            };
        }
        
        return options;
    };

    

    grunt.loadNpmTasks('grunt-mocha-test');   

    grunt.registerTask('testing:scaffold', 'Create directory scaffold for tests', function() {
        fs.mkdirSync('./test');
        fs.mkdirSync('./test/shots');
        fs.mkdirSync('./test/baseline');
        fs.mkdirSync('./test/specs');
        grunt.task.run(['testing:examples:config', 'testing:examples']);
    });
    
    grunt.registerTask('testing:shots:clear', 'Removes any pre-existing failure screenshots', function() {
        let testingOpts = require(path.resolve( __dirname, 'lib', 'options.js'));
        let dir = testingOpts.shotFolder;
        fs.readdirSync(dir).forEach(f => fs.rmSync(`${dir}/${f}`));
    });
    
    grunt.registerTask('testing:baseline:clear', 'Removes any visual regression baseline images', function() {
        fs.emptyDirSync('./test/baseline');
    });

    let driver;
    grunt.registerTask('testing:browser:spawn', 'Starts Browser driver', function() {
        let options = grunt.config.get(['testing', 'browserOptions', type]) || {};
        // Defaults to chrome if no browser options passed
        // Both chromedriver and chrome for testing must be in the PATH system variable if they are not passed.
        if(!options.hasOwnProperty('type')){
            options.type = "chrome";
        }

        let browserObj;

        switch(options.type){
            case 'chrome':
                browserObj = webdriver.Browser.CHROME;
                break;
            case 'firefox':
                browserObj = webdriver.Browser.FIREFOX;
                break;
            default: 
                grunt.fail.fatal(`${options.type} is not a supported driver`);
                return;
        }


        let chromeOptions = options.chrome || {};
        let firefoxOptions = options.firefox || {};

        driver = new webdriver.Builder()
            .forBrowser(browserObj)
            .setChromeOptions(chromeOptions)
            .setFirefoxOptions(firefoxOptions)
            .build();

    });

    grunt.registerTask('testing:baseline', 'Creates baseline shots for comparison', function(env, spec) {
        grunt.config.merge({
            testing: {
                global:{
                    shotFolder: './test/baseline',
                    clearScreenShots: false,
                    visualCompare: false
                }
            }
        });

        let task = 'testing';

        if(env){
            task += `:${env}`;
        }

        if(spec){
            task += `:${spec}`;
        }

        grunt.task.run([task]);

    });
    

    grunt.registerTask('testing:examples', 'Copy Example Specs to project', function(envName){
        let allOptions = grunt.config.get(['testing']);

        if(!envName || envName == 'default'){
            envName = allOptions.defaultEnvironment;
        }
        process.env.TESTING_ENV = envName;
        process.env.TESTING_OPTIONS = JSON.stringify(allOptions);
        let testingOpts = require(path.resolve(__dirname, 'lib', 'options.js'));
        let examplesFolder = path.resolve(__dirname, '../examples/');


        let allExamples = fs.readdirSync(examplesFolder);
        let existingSpecs = fs.readdirSync(testingOpts.specFolder);

        for(const example of allExamples){
            let existingPath = path.resolve(testingOpts.specFolder, example);
            try{
                fs.accessSync(existingPath);
            } catch(ex) {
                fs.copyFileSync(path.resolve(examplesFolder, example), existingPath);
                console.log('Copied ' + example + ' to project.');
            }
        }
    });

    grunt.registerTask('testing:examples:config', 'Copy Example Config to project', function(envName){
        let source = path.resolve(__dirname, '../', 'testing.config.json.example');
        let target = path.resolve('./', 'testing.config.json.example');
        fs.copyFileSync(source, target);
    });

    grunt.registerTask('testing' , 'Run tests', function(envName, spec) {

        envName = envName || grunt.option('env');
        spec = spec || grunt.option('spec');

        let allOptions = grunt.config.get(['testing']);

        if(!envName || envName == 'default'){
            envName = allOptions.defaultEnvironment;
        }
        process.env.TESTING_ENV = envName;
        process.env.TESTING_OPTIONS = JSON.stringify(allOptions);
        let testingOpts = require(path.resolve(__dirname, 'lib', 'options.js'));
        spec = spec || '**/*';


        let src = testingOpts.specFolder + '/' + spec + '.js';
        fs.writeFileSync(path.resolve(__dirname, 'currentOptions.json'), JSON.stringify(testingOpts));
        return;

        
        
        grunt.config.merge({
            mochaTest: {
                e2e: {
                    options: {
                        reporter: 'mocha-multi',
                        reporterOptions: reporterOptions('e2e'),
                        ui: 'bdd',
                        timeout: 90000 /*90 seconds*/
                    },
                    src: [
                      path.resolve(__dirname, 'lib', 'setup.js'),
                      src
                    ]
                }
            }
        });
        let tasks = ['mochaTest:e2e'];

        if(testingOpts.clearScreenShots){
            tasks.unshift('testing:shots:clear');
        }
        
        grunt.task.run(tasks);

    });
}