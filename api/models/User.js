/**
 * User.js
 *
 * @description :: TODO: User information
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    nick: {
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
    shares: {
      type: 'boolean'
    },
    stage1song: {
      type: 'string'
    },
    stage3song: {
      type: 'string'
    },
    homebound: {
      type: 'float'
    },
    explorer: {
      type: 'float'
    },
    questionWhen: {
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
