
# National Day Calendar

This is Scott's tool to download and reformat all of the pictures from the National Day Calendar website.  Scott uses these as backgrounds during virtual meetings.  

## Setup:
If you haven't already, you'll need a user-script plugin for your web browser.  Scott uses <a href="https://github.com/greasemonkey/greasemonkey">Grease Monkey</a> on Firefox, but it's also possible to use another plugin like <a href="https://en.wikipedia.org/wiki/Tampermonkey">Tampermonkey</a> in other browsers, such as Chrome.

Once that is installed, you'll also need the <a href="public/NationalDayCalendar.user.js">National Day Calendar</a> user script installed.

You will also need:
1. Profound.js:  `npm install profoundjs`
2. Sharp:  `cd profoundjs; npm install sharp`
3. Needle (from profoundjs dir):  `npm install needle@2.4.0`

## Daily Usage
To use this program follow these steps:

1. Run this workspace.
2. Click the "Today" or "Tomorrow" button to open the appropriate page on the National Day Calendar website.
3. Wait for page to fully load.
4. In the upper-left corner, the user script should have added an "Open List" button.  When you click this, the user script will you a text area with a list of all of the images (one per line) for the day you've chosen.  Copy this to the clipboard.
5. Back in this application, paste the list into the "URLs" text area.
6. Verify that the "Folder to save to" is correct.  Don't forget to update it to the date you clicked (either Today's or Tomorrow's date).
7. Click "Go"
