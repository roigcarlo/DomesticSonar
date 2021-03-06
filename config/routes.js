/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/lalala': {
    view: 'homepage'
  },

  '/': {
    controller: 'Login',
    action: 'wellcome'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  /**************************************************************************/
  /* Interruptions from the time-keeper                                     */
  /**************************************************************************/

  '/startPhase1': {
    controller: 'Interrupt',
    action: 'startPhase1'
  },

  '/startPhase2': {
    controller: 'Interrupt',
    action: 'startPhase2'
  },

  '/startPhase3': {
    controller: 'Interrupt',
    action: 'startPhase3'
  },

  '/startPhase4': {
    controller: 'Interrupt',
    action: 'startPhase4'
  },

  /**************************************************************************/
  /* Events from the App                                                    */
  /**************************************************************************/

  '/createNewSession': {
    controller: 'Interrupt',
    action: 'createNewSession'
  },

  /**************************************************************************/
  /* front-end UserSide                                                     */
  /**************************************************************************/

  '/login': {
    controller: 'Login',
    action: 'login'
  },

  '/callback': {
    controller: 'Login',
    action: 'callback'
  },

  '/reward': {
    controller: 'experience',
    action: 'reward'
  },

  /**************************************************************************/
  /* front-end AppSide                                                      */
  /**************************************************************************/

  '/experience': {
    controller: 'Experience',
    action: 'reward'
  },

  /**************************************************************************/
  /* Calculate parameters                                                   */
  /**************************************************************************/

  '/calculateHomeboundness': {
    controller: 'Experience',
    action: 'calculateHomeboundness'
  },

  '/calculateExplorerness': {
    controller: 'Experience',
    action: 'calculateExplorerness'
  },

  '/calculateMostListen': {
    controller: 'Experience',
    action: 'calculateMostListen'
  },

  '/updateShare': {
    controller: 'Experience',
    action: 'updateShare'
  },

  '/updateMostListenedSong' : {
    controller: 'Track',
    action: 'updateMostListenedSong'
  },

  '/createDesire': {
    controller: 'Experience',
    action: 'createDesire'
  },

  /**************************************************************************/
  /* Player                                                                 */
  /**************************************************************************/

  '/player': {
    controller: 'Player',
    action: 'player'
  },

  '/changeSong': {
    controller: 'Player',
    action: 'changeSong'
  },

  /**************************************************************************/
  /* Random                                                                 */
  /**************************************************************************/

  '/test': {
    view: 'app/text'
  },

  '/testTrack': {
    view: 'test/trackFeatures'
  },
};
