'use strict';

module.exports = {
    db: 'mongodb://localhost/mean-prod',
    app: {
        name: 'Mean Civil Government - Production',
        env: 'production',
        publicUrl: 'http://77.91.132.7:3000'
    },
    facebook: {
        clientID: '293563647490831',
        clientSecret: 'c17655c17fb2417db794c123267aaa60',
        callbackURL: 'http://77.91.132.7:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: '8zZJ9Q2IWUiQNEcXYjV9mvxsn',
        clientSecret: 'DKsmEXU7zQxsjPT5zKmLlaY0pqjUI7CiQ3vfovV1JXhXvyvJGa',
        callbackURL: 'http://77.91.132.7:3000/auth/twitter/callback'
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
