'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Activists = new Module('activists');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Activists.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Activists.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
//    Activists.menus.add({
//        title: 'activists example page',
//        link: 'activists example page',
//        roles: ['authenticated'],
//        menu: 'main'
//    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
     Activists.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
     Activists.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
     Activists.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    Activists.aggregateAsset('css', 'activists.css');

    return Activists;
});
