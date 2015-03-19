/***
 * This code changes the field seen into true, thus removing them from the viewer's notice.
 */

Router.onBeforeAction(function() {
    clearErrors();
    this.next();
});

