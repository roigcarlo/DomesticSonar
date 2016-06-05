/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    accessToken: {
      type: 'string',
    },
    expiresOn: {
      type: 'date',
    },
    refreshToken: {
      type: 'string',
    },
    mail: {
      type: 'string',
    },
    releaseOn: {
      type: 'date',
    },
    homebound: {
      type: 'boolean'
    },
    explorer: {
      type: 'boolean'
    },
  }
};
