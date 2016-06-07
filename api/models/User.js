/**
 * User.js
 *
 * @description :: TODO: User information
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    mail: {
      type: 'string'
    },
    accessToken: {
      type: 'string'
    },
    refreshToken: {
      type: 'string'
    },
    expiresOn: {
      type: 'date'
    },
    homebound: {
      type: 'float'
    },
    explorer: {
      type: 'float'
    },
    questionOn: {
      type: 'date'
    },
    questionWhere: {
      type: 'string'
    },
    questionWith: {
      type: 'string'
    },
    questionDoing: {
      type: 'string'
    },
    questionFeeling: {
      type: 'string'
    },
    releaseOn: {
      type: 'date'
    },
  }

};
