'use strict';

module.exports = {
    db: 'mongodb://localhost/mean-dev',
    app: {
        name: 'Civil government',
        env: 'development',
        publicUrl: 'http://127.0.0.1:3000'
    },
    facebook: {
        clientID: '293563647490831',
        clientSecret: 'c17655c17fb2417db794c123267aaa60',
        callbackURL: 'http://127.0.0.1.xip.io:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    },
    vkontakte: {
        clientID: 'APP_ID',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/vkontakte/callback'
    }
};
