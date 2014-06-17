'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Organisations = new Module('Organisations');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Organisations.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Organisations.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
//    Organisations.menus.add({
//        title: 'organisations example page',
//        link: 'organisations example page',
//        roles: ['authenticated'],
//        menu: 'main'
//    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Organisations.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Organisations.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Organisations.settings(function(err, settings) {
        //you now have the settings object
    });
    */
    Organisations.aggregateAsset('css', 'organisations.css');

    return Organisations;
});
