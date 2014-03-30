twitch_challenge
================

twitch.tv api code challenge
[Live Demo] (http://theinternauts.github.io/twitch_challenge/)

## The original submission's code can be found in a branch called ["original-submission"] (https://github.com/theInternauts/twitch_challenge/tree/original-submission)

###added after the dealine submission
* better error handling for the Async module
* Used .bind() to handle executuion scope more gracefully and remove the explicit reference to the app.  (that was REALLY bad)
* fixed a bug where the generated query string was an incorrect request URL
* pagination
* JSONP support in the AsyncModule()
* Using a rudimentary (read 'makeshift') MVC organization that depends on events for inter-communication amoung the Views and Controller

###Known problems
* ~~can't get past cross-origin/cross-domain HTTP GET requests in order to ping the real twitch.tv API.~~
* ~~need pagination for a real dataset that's larger than 5-10 items.  (can't do this until I deal with the previous issue)~~
* ~~the results list is still unstyled~~
* ~~need to refactor as a MVC for better code organization/modularity~~
* Could use a little namespacing to clean up the global space a bit OR implement Require.js (for other added benefits, as well)
