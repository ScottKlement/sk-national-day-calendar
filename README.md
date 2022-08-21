
# National Day Calendar

This is Scott's tool to download and reformat all of the pictures from the National Day Calendar website.  Scott uses these as backgrounds during virtual meetings.  

## Setup:
If you haven't already, you'll need a user-script plugin for your web browser.  Scott uses <a href="https://github.com/greasemonkey/greasemonkey">Grease Monkey</a> on Firefox, but it's also possible to use another plugin like <a href="https://en.wikipedia.org/wiki/Tampermonkey">Tampermonkey</a> in other browsers, such as Chrome.

Once that is installed, you'll also need the <a href="public/NationalDayCalendar.user.js">National Day Calendar</a> user script installed.  You can also install it by clicking the "Install Script" button inside the application.

You will also need:
1. Express: `npm install express`
2. Express-Async-Handler: `npm install express-async-handler`
3. Sharp: `npm install sharp`
4. Needle: `npm install needle`

Or just use `npm install`

## Daily Usage
To use this program follow these steps:

1. `node nationalDay.js`
2. Connect with your browser to http://localhost:8080
3. Click the "Today" or "Tomorrow" button to open the appropriate page on the National Day Calendar website.
4. Wait for page to fully load.
5. In the upper-left corner, the user script should have added an "Open List" button.  When you click this, the user script will you a text area with a list of all of the images (one per line) for the day you've chosen.  Copy this to the clipboard.
6. Back in this application, paste the list into the "URLs" text area.
7. Verify that the "Folder to save to" is correct.  Don't forget to update it to the date you clicked (either Today's or Tomorrow's date).
8. Click "Go"
