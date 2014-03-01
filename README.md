twitch_challenge
================

twitch.tv api code challenge

## The original submission can be found in a branch called ["original-submission"] (https://github.com/theInternauts/twitch_challenge/tree/original-submission)

###added after the dealine submission
* better error handling for the Async module
* Used .bind() to handle executuion scope more gracefully and remove the explicit reference to the app.  (that was REALLY bad)
* fixed a bug where the generated query string was an incorrect request URL

###Known problems
* can't get past cross-origin/cross-domain HTTP GET requests in order to ping the real twitch.tv API. 
* need pagination for a real dataset that's larger than 5-10 items.  (can't do this until I deal with the previous issue)
* the results list is still unstyled
