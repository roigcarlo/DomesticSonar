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
      type: 'int',
      size: 32
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
      type: 'int',
      size: 32
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
    released: {
      type: 'boolean'
    },
    releaseOn: {
      type: 'int',
      size: 32
    },
  }

};
