/**
 * Status.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    currentUser: {
      model:'User',
    },
    sessionId: {
      type: 'string'
    },
    stage: {
      type: 'int'
    }
  }
};
