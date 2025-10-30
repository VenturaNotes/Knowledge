---
tags:
  - type/project
  - status/complete
---
## Solutions
### Solution 1
- Works in google sheets Apps Script
#### MyScript.gs
```python
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 1
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}
```

#### Sidebar.html
```python
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>

    <script>
      function logTime() {
        google.script.run.logTime();
      }
    </script>
  </body>
</html>
```
### Solution 2
#### MyScript.gs
```javascript
const scriptProperties = PropertiesService.getScriptProperties();

// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();

  scriptProperties.setProperties({
    'ProgressMinimum': 'Null',
    'ProgressBaseline': 'Null',
    'PaceMinimum': 'Null',
    'PaceBaseline': 'Null'
  });
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell, oldValue, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  while (oldValue == value.toString())
    {
      SpreadsheetApp.flush();
      Utilities.sleep(50); 
      value = sheet.getRange(cell).getDisplayValue();
    }
  scriptProperties.setProperty(key, value.toString());
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2', scriptProperties.getProperty('ProgressMinimum'), 'ProgressMinimum');
  cellValues.L2 = getCellValue('L2', scriptProperties.getProperty('ProgressBaseline'), 'ProgressBaseline');
  cellValues.Q2 = getCellValue('Q2', scriptProperties.getProperty('PaceMinimum'), "PaceMinimum");
  cellValues.N2 = getCellValue('N2', scriptProperties.getProperty('PaceBaseline'), 'PaceBaseline');
  return cellValues;
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <div id="cellValueP2" class="cellValue">Loading...</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">Loading...</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">Loading...</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">Loading...</div>
    <div>Pace Baseline</div>

    <script>
      function logTime() {
        google.script.run.logTime();
        updateCellValues();
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = updateCellValues;
    </script>
  </body>
</html>
```
#### Description
- Difference with this one is that I'm able to view my pace and progress in an updated fashion! 

### Solution 3
#### MyScript.gs
```Javascript
const scriptProperties = PropertiesService.getScriptProperties();

// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();

  scriptProperties.setProperties({
    'ProgressMinimum': 'Null',
    'ProgressBaseline': 'Null',
    'PaceMinimum': 'Null',
    'PaceBaseline': 'Null'
  });
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell, oldValue, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  while (oldValue == value.toString())
    {
      SpreadsheetApp.flush();
      Utilities.sleep(50); 
      value = sheet.getRange(cell).getDisplayValue();
    }
  scriptProperties.setProperty(key, value.toString());
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2', scriptProperties.getProperty('ProgressMinimum'), 'ProgressMinimum');
  cellValues.L2 = getCellValue('L2', scriptProperties.getProperty('ProgressBaseline'), 'ProgressBaseline');
  cellValues.Q2 = getCellValue('Q2', scriptProperties.getProperty('PaceMinimum'), "PaceMinimum");
  cellValues.N2 = getCellValue('N2', scriptProperties.getProperty('PaceBaseline'), 'PaceBaseline');
  return cellValues;
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16

  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    return duration;
  } else {
    return '00:00:00'; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      #timeButton {
        position: fixed;
        bottom: 60px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Current Duration</button>
    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="cellValueP2" class="cellValue">Loading...</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">Loading...</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">Loading...</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">Loading...</div>
    <div>Pace Baseline</div>

    <script>
      function logTime() {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;
        google.script.run.logTime();
        updateCellValues();
      }

      function showCurrentDuration() {
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration;
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = updateCellValues;
    </script>
  </body>
</html>
```


#### Description
- Refresh the page, insert `"=Now()"`, and then start studying. Use "Current Time" to view your current segment duration. Then use "Log Time" when you've completed a page/video/etc.
- Includes the current duration of how long you've been working (just great to see how much time has went by!)

### Solution 4
#### MyScript.gs
```javascript
const scriptProperties = PropertiesService.getScriptProperties();

// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Time Tracking')
    .addItem('Timers', 'showSidebar')
    .addToUi();

  scriptProperties.setProperties({
    'ProgressMinimum': 'Null',
    'ProgressBaseline': 'Null',
    'PaceMinimum': 'Null',
    'PaceBaseline': 'Null'
  });
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Timers');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS, handles negative durations
function formatDuration(durationMs) {
  var isNegative = durationMs < 0;
  var totalSeconds = Math.abs(Math.floor(durationMs / 1000));
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}


// Function to get the value from a cell
function getCellValue(cell, oldValue, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  while (oldValue == value.toString())
    {
      SpreadsheetApp.flush();
      Utilities.sleep(50); 
      value = sheet.getRange(cell).getDisplayValue();
    }
  scriptProperties.setProperty(key, value.toString());
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2', scriptProperties.getProperty('ProgressMinimum'), 'ProgressMinimum');
  cellValues.L2 = getCellValue('L2', scriptProperties.getProperty('ProgressBaseline'), 'ProgressBaseline');
  cellValues.Q2 = getCellValue('Q2', scriptProperties.getProperty('PaceMinimum'), "PaceMinimum");
  cellValues.N2 = getCellValue('N2', scriptProperties.getProperty('PaceBaseline'), 'PaceBaseline');
  return cellValues;
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timeLeft = new Date(sheet.getRange(lastRow + 1, 3).getValue());
  var initialDate = new Date(1899, 11, 30);
  var timeLeftFormatted = formatDuration(timeLeft- initialDate);


  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp;
    var duration = formatDuration(durationMs);

    var timeLeftDuration = formatDuration(timeLeft - initialDate - durationMs);

    return [duration, timeLeftDuration];
  } else {
    return ['00:00:00', timeLeftFormatted]; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      #timeButton {
        position: fixed;
        bottom: 60px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Duration</button>
    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="timeLeft" class="cellValue">Time Left: 00:00:00</div>
    <div id="cellValueP2" class="cellValue">Loading...</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">Loading...</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">Loading...</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">Loading...</div>
    <div>Pace Baseline</div>

    <script>
      function logTime() {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: 00:00:00';
        timeLeftDiv.style.color = 'black';

        google.script.run.logTime();
        updateCellValues();
      }

      function showCurrentDuration() {
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration[0];

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: ' + duration[1];

        if (duration[1].startsWith('-')) {
          timeLeftDiv.style.color = 'red';
        } else {
          timeLeftDiv.style.color = 'green';
        }
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = updateCellValues;
    </script>
  </body>
</html>
```
#### Description
- Added a "Time Left" section telling me how much time left I had per segment
	- Would be green if positive and red if negative
		- Changed "formatDuration" function so it works with negatives as well

### Solution 5
#### MyScript.gs
```javascript
const scriptProperties = PropertiesService.getScriptProperties();

// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Time Tracking')
    .addItem('Timers', 'showSidebar')
    .addToUi();

  scriptProperties.setProperties({
    'ProgressMinimum': 'Null',
    'ProgressBaseline': 'Null',
    'PaceMinimum': 'Null',
    'PaceBaseline': 'Null'
  });
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Timers');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS, handles negative durations
function formatDuration(durationMs) {
  var isNegative = durationMs < 0;
  var totalSeconds = Math.abs(Math.floor(durationMs / 1000));
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell, oldValue, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  while (oldValue == value.toString())
    {
      SpreadsheetApp.flush();
      Utilities.sleep(50); 
      value = sheet.getRange(cell).getDisplayValue();
    }
  scriptProperties.setProperty(key, value.toString());
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2', scriptProperties.getProperty('ProgressMinimum'), 'ProgressMinimum');
  cellValues.L2 = getCellValue('L2', scriptProperties.getProperty('ProgressBaseline'), 'ProgressBaseline');
  cellValues.Q2 = getCellValue('Q2', scriptProperties.getProperty('PaceMinimum'), "PaceMinimum");
  cellValues.N2 = getCellValue('N2', scriptProperties.getProperty('PaceBaseline'), 'PaceBaseline');
  return cellValues;
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var initialDate = new Date(1899, 11, 30);
  
  var timeLeft = new Date(sheet.getRange(lastRow + 1, 3).getValue());
  var timeLeftFormatted = formatDuration(timeLeft- initialDate);

  var totalTimeLeft = new Date(sheet.getRange(lastRow, 8).getValue());
  var totalTimeLeftFormatted = formatDuration(totalTimeLeft- initialDate);

  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp;
    var duration = formatDuration(durationMs);

    var timeLeftDuration = formatDuration(timeLeft - initialDate - durationMs);
    var totalTimeDuration = formatDuration(totalTimeLeft - initialDate + (timeLeft - initialDate - durationMs));
    console.log(totalTimeDuration);

    return [duration, timeLeftDuration,totalTimeDuration];
  } else {
    return ['00:00:00', timeLeftFormatted, totalTimeLeftFormatted]; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      #timeButton {
        position: fixed;
        bottom: 60px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Duration</button>
    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="timeLeft" class="cellValue">Time Left: 00:00:00</div>
    <div id="totalTimeLeft" class="cellValue">Total Time Left: 00:00:00</div>
    <div id="cellValueP2" class="cellValue">Loading...</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">Loading...</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">Loading...</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">Loading...</div>
    <div>Pace Baseline</div>

    <script>
      function logTime() {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: 00:00:00';
        timeLeftDiv.style.color = 'black';

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: 00:00:00';
        totalTimeLeftDiv.style.color = 'black';

        google.script.run.logTime();
        updateCellValues();
      }

      function showCurrentDuration() {
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration[0];

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: ' + duration[1];

        if (duration[1].startsWith('-')) {
          timeLeftDiv.style.color = 'red';
        } else {
          timeLeftDiv.style.color = 'green';
        }

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: ' + duration[2];

        if (duration[2].startsWith('-')) {
          totalTimeLeftDiv.style.color = 'red';
        } else {
          totalTimeLeftDiv.style.color = 'green';
        }
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = updateCellValues;
    </script>
  </body>
</html>
```
#### Description
- Added a "Total Time Left" which is pretty much the time left that you have saved or are ahead of your current working time
### Solution 6

#### MyScript.gs
```javascript
const scriptProperties = PropertiesService.getScriptProperties();

// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Time Tracking')
    .addItem('Timers', 'showSidebar')
    .addToUi();

  scriptProperties.setProperties({
    'ProgressMinimum': 'Null',
    'ProgressBaseline': 'Null',
    'PaceMinimum': 'Null',
    'PaceBaseline': 'Null'
  });
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Timers');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS, handles negative durations
function formatDuration(durationMs) {
  var isNegative = durationMs < 0;
  var totalSeconds = Math.abs(Math.floor(durationMs / 1000));
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell, oldValue, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  while (oldValue == value.toString())
    {
      SpreadsheetApp.flush();
      Utilities.sleep(50); 
      value = sheet.getRange(cell).getDisplayValue();
    }
  scriptProperties.setProperty(key, value.toString());
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2', scriptProperties.getProperty('ProgressMinimum'), 'ProgressMinimum');
  cellValues.L2 = getCellValue('L2', scriptProperties.getProperty('ProgressBaseline'), 'ProgressBaseline');
  cellValues.Q2 = getCellValue('Q2', scriptProperties.getProperty('PaceMinimum'), "PaceMinimum");
  cellValues.N2 = getCellValue('N2', scriptProperties.getProperty('PaceBaseline'), 'PaceBaseline');
  return cellValues;
}

function calculateMultiplier() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(4, 3).setValue(sheet.getRange(4, 3).getValue() / sheet.getRange(getLastRowInColumn(11), 11).getValue());
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var initialDate = new Date(1899, 11, 30);
  
  // Just need a 30 minute offset which is good :) 
  
  var timeLeft = new Date(sheet.getRange(lastRow + 1, 3).getValue());
  var timeLeftFormatted = formatDuration(timeLeft- initialDate);

  var totalTimeLeft = new Date(sheet.getRange(lastRow, 8).getValue());
  var totalTimeLeftFormatted = formatDuration(totalTimeLeft- initialDate);

  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp;
    var duration = formatDuration(durationMs);

    var timeLeftDuration = formatDuration(timeLeft - initialDate - durationMs);
    var totalTimeDuration = formatDuration(totalTimeLeft - initialDate + (timeLeft - initialDate - durationMs)+300000);

    return [duration, timeLeftDuration,totalTimeDuration];
  } else {
    return ['00:00:00', timeLeftFormatted, totalTimeLeftFormatted]; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton, #timeButton, #multiplierButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      #multiplierButton{
        left: 20px;
        right: auto;
        //right: 100px;
      }
      #timeButton {
        bottom: 60px;
      }
      .pressed {
        opacity: 0.5;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Duration</button>
    <button id="multiplierButton" onclick="calculateMultiplier()">Adjust Speed</button>
    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="timeLeft" class="cellValue">Time Left: 00:00:00</div>
    <div id="totalTimeLeft" class="cellValue">Total Time Left: 00:00:00</div>
    <div id="cellValueP2" class="cellValue">Loading...</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">Loading...</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">Loading...</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">Loading...</div>
    <div>Pace Baseline</div>

    <script>
      function logTime() {
        pressButton('floatingButton');
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: 00:00:00';
        timeLeftDiv.style.color = 'black';

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: 00:00:00';
        totalTimeLeftDiv.style.color = 'black';

        google.script.run.logTime();
        updateCellValues();
      }

      function showCurrentDuration() {
        pressButton('timeButton');
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
      }

      function calculateMultiplier(){
        pressButton('multiplierButton');
        google.script.run.calculateMultiplier();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration[0];

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: ' + duration[1];

        if (duration[1].startsWith('-')) {
          timeLeftDiv.style.color = 'red';
        } else {
          timeLeftDiv.style.color = 'green';
        }

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: ' + duration[2];

        if (duration[2].startsWith('-')) {
          totalTimeLeftDiv.style.color = 'red';
        } else {
          totalTimeLeftDiv.style.color = 'green';
        }
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      function pressButton(buttonId) {
        var button = document.getElementById(buttonId);
        button.classList.add('pressed');
        setTimeout(function() {
          button.classList.remove('pressed');
        }, 200);
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = updateCellValues;
    </script>
  </body>
</html>
```
#### Description
- Added button GUI so I'm able to get feedback if a button was pressed or not
- Added - `+300000` for totalTimeDuration to be based on 30 minutes?
- Added new button to automatically change the multiplier based on average rate

### Solution 7
#### MyScript.gs
```javascript
var segment = 1200000; //20 minutes
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Time Tracking')
    .addItem('Timers', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Timers');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  var level = sheet.getRange(4, 17).getValue();
  var handicap = sheet.getRange(5, 17).getValue();

  sheet.getRange(lastRow+1, 18).setValue(level);
  sheet.getRange(lastRow+1, 19).setValue(handicap);

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function startTime(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = getLastRowInColumn(16)
  var timestamp = new Date();

  if (lastRow == 3){
    sheet.getRange(lastRow + 1, 16).setValue(timestamp);
  }
  else
  {
    sheet.getRange(lastRow, 16).setValue(timestamp);
  }
  return 
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS, handles negative durations
function formatDuration(durationMs) {
  var isNegative = durationMs < 0;
  var totalSeconds = Math.abs(Math.floor(durationMs / 1000));
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2');
  cellValues.L2 = getCellValue('L2');
  cellValues.Q2 = getCellValue('Q2');
  cellValues.N2 = getCellValue('N2');
  return cellValues;
}

function pad2(number, digits = 2) {
  return number.toString().padStart(digits, '0');
}

// Helper function to format duration in HH:MM:SS.mmm, handles negative durations
function formatDuration2(durationMs) {
  var isNegative = durationMs < 0;
  var totalMilliseconds = Math.abs(durationMs);
  var totalSeconds = Math.floor(totalMilliseconds / 1000);
  var milliseconds = Math.floor(totalMilliseconds % 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds) + '.' + pad2(milliseconds, 3);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}


function calculateMultiplier() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var initialDate = new Date(1899, 11, 30);
  var updateCell = false;

  var lastRow = getLastRowInColumn(8)
  var difference = sheet.getRange(lastRow, 8).getValue();
  
  var differenceMs = difference - initialDate; //Format is in terms of milliseconds

  if(differenceMs <= -segment){
    sheet.getRange(5, 17).setValue(sheet.getRange(5, 17).getValue() + 1);
    updateCell = true;
  }
  else if (differenceMs >= segment){
    var differenceTruncated = Math.trunc(differenceMs / segment);
    sheet.getRange(4, 17).setValue(sheet.getRange(4, 17).getValue() + differenceTruncated);
    updateCell = true;
  }

  if (updateCell)
  {
    sheet.getRange(6, 17).setValue("0:00:00");

    var level = sheet.getRange(4, 17).getValue();
    var handicap = sheet.getRange(5, 17).getValue();
    var oldRate =  sheet.getRange(lastRow, 11).getValue() / sheet.getRange(4, 3).getValue();
    var newRate = (oldRate*level) / (handicap + level);
    var percentage = newRate / oldRate;
    var oldMultiplier = 1 / oldRate;

    if (oldMultiplier <= 1)
    {
      var newMultiplier = 1 + percentage*(oldMultiplier - 1);
    }
    else
    {
      var newMultiplier = (oldMultiplier*2) + percentage*(oldMultiplier-oldMultiplier*2);
    }

    sheet.getRange(4, 3).setValue(newMultiplier);
    sheet.getRange(lastRow, 18).setValue(level);
    sheet.getRange(lastRow, 19).setValue(handicap);
    SpreadsheetApp.flush();
    Utilities.sleep(250); 
    sheet.getRange(6, 17).setValue(formatDuration2(sheet.getRange(lastRow, 8).getValue() - initialDate));

  }
  //Needs to be here or potential error. 
  return [sheet.getRange(4, 17).getValue(),sheet.getRange(5, 17).getValue()];
}

function fetchStats(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  return [sheet.getRange(4, 17).getValue(),sheet.getRange(5, 17).getValue()]
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var initialDate = new Date(1899, 11, 30);
  
  var timeLeft = new Date(sheet.getRange(lastRow + 1, 3).getValue());
  var timeLeftFormatted = formatDuration(timeLeft- initialDate);

  var totalTimeLeft = new Date(sheet.getRange(lastRow, 8).getValue());
  var totalTimeLeftFormatted = formatDuration(totalTimeLeft- initialDate);

  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp;
    var duration = formatDuration(durationMs);

    var timeLeftDuration = formatDuration(timeLeft - initialDate - durationMs);
    var totalTimeDuration = formatDuration(totalTimeLeft - initialDate + (timeLeft - initialDate - durationMs)+segment);

    return [duration, timeLeftDuration,totalTimeDuration];
  } else {
    return ['00:00:00', timeLeftFormatted, totalTimeLeftFormatted]; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton, #timeButton, #multiplierButton, #startButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      #multiplierButton{
        left: 20px;
        right: auto;
        //right: 100px;
      }
      #timeButton {
        bottom: 60px;
      }
      #startButton {
        left: 20px;
        right: auto;
        bottom: 60px;
      }
      .pressed {
        opacity: 0.5;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Duration</button>
    <button id="multiplierButton" onclick="calculateMultiplier()">Adjust Speed</button>
    <button id="startButton" onclick="showStartTime()">Start</button>
    
    <div id="level" class="cellValue">Level: ...</div>
    <div id="handicap" class="cellValue">Handicap: ...</div>

    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="timeLeft" class="cellValue">Time Left: 00:00:00</div>
    <div id="totalTimeLeft" class="cellValue">Total Time Left: 00:00:00</div>
    
    <div id="cellValueP2" class="cellValue">00:00:00</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">00:00:00</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">00:00:00</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">00:00:00</div>
    <div>Pace Baseline</div>

    <div id="cellLoading" class="cellValue">Loading</div>

    <script>
      function logTime() {
        showLoading();
        pressButton('floatingButton');
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: 00:00:00';
        timeLeftDiv.style.color = 'black';

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: 00:00:00';
        totalTimeLeftDiv.style.color = 'black';
        
        google.script.run.withSuccessHandler(showComplete).logTime();
      }

      function showCurrentDuration() {
        showLoading();
        pressButton('timeButton');
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
        updateCellValues();
      }

      function showStartTime(){
        showLoading();
        pressButton('startButton');
        google.script.run.withSuccessHandler(showComplete).startTime();
      }

      function showLoading(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Loading";
        cellValueDiv.style.color = 'red';
      }

      function showComplete(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Ready";
        cellValueDiv.style.color = 'green';
      }

      function calculateMultiplier(){
        pressButton('multiplierButton');
        showLoading();
        google.script.run.withSuccessHandler(displayStats).calculateMultiplier();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration[0];

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: ' + duration[1];

        if (duration[1].startsWith('-')) {
          timeLeftDiv.style.color = 'red';
        } else {
          timeLeftDiv.style.color = 'green';
        }

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: ' + duration[2];

        if (duration[2].startsWith('-')) {
          totalTimeLeftDiv.style.color = 'red';
        } else {
          totalTimeLeftDiv.style.color = 'green';
        }
        showComplete();
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function startGame(){
        showLoading();
        google.script.run.withSuccessHandler(displayStats).fetchStats();
      }

      function displayStats(stats){
        var cellValueLevel = document.getElementById('level');
        var cellValueHandicap = document.getElementById('handicap');

        cellValueLevel.textContent = "Level: " + stats[0];
        cellValueHandicap.textContent = "Handicap: " + stats[1];

        showComplete();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      function pressButton(buttonId) {
        var button = document.getElementById(buttonId);
        button.classList.add('pressed');
        setTimeout(function() {
          button.classList.remove('pressed');
        }, 200);
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = startGame;
    </script>
  </body>
</html>
```
#### Description
- Changed the duration button to show the progress and pace times
	- Removed Log Time from updating the times. No longer saves so the sidebar no longer needs to be constantly refreshed
- Added a "loading" and "complete" indicator
- Added a "start" button
- Added graphs + entire game

### Solution 8
#### MyScript.gs
```javascript
var segment = 1200000; //20 minutes
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Time Tracking')
    .addItem('Timers', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Timers');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  var initialDate = new Date(1899, 11, 30);
  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;
  
  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp + storedValueDuration;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  var level = sheet.getRange(4, 17).getValue();
  var handicap = sheet.getRange(5, 17).getValue();

  sheet.getRange(lastRow+1, 18).setValue(level);
  sheet.getRange(lastRow+1, 19).setValue(handicap);

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function startTime(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = getLastRowInColumn(16)
  var timestamp = new Date();

  if (lastRow == 3){
    sheet.getRange(lastRow + 1, 16).setValue(timestamp);
  }
  else
  {
    sheet.getRange(lastRow, 16).setValue(timestamp);
  }
  return 
}

function storeTimeSegment(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  
  var initialDate = new Date(1899, 11, 30);
  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;
  
  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }
  
  var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
  var currentTimestamp = new Date();
  
  var durationMs = currentTimestamp - prevTimestamp + storedValueDuration;
  var duration = formatDuration(durationMs);

  sheet.getRange(lastRow + 1, 21).setValue(duration);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS, handles negative durations
function formatDuration(durationMs) {
  var isNegative = durationMs < 0;
  var totalSeconds = Math.abs(Math.floor(durationMs / 1000));
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2');
  cellValues.L2 = getCellValue('L2');
  cellValues.Q2 = getCellValue('Q2');
  cellValues.N2 = getCellValue('N2');
  return cellValues;
}

function pad2(number, digits = 2) {
  return number.toString().padStart(digits, '0');
}

// Helper function to format duration in HH:MM:SS.mmm, handles negative durations
function formatDuration2(durationMs) {
  var isNegative = durationMs < 0;
  var totalMilliseconds = Math.abs(durationMs);
  var totalSeconds = Math.floor(totalMilliseconds / 1000);
  var milliseconds = Math.floor(totalMilliseconds % 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds) + '.' + pad2(milliseconds, 3);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}


function calculateMultiplier() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var initialDate = new Date(1899, 11, 30);
  var updateCell = false;

  var lastRow = getLastRowInColumn(8)
  var difference = sheet.getRange(lastRow, 8).getValue();
  
  var differenceMs = difference - initialDate; //Format is in terms of milliseconds

  if(differenceMs < 0){
    if (sheet.getRange(4, 17).getValue() != 0)
    {
      sheet.getRange(5, 17).setValue(sheet.getRange(5, 17).getValue() + 1);
    }
    updateCell = true;
  }
  else if (differenceMs >= 0){
    sheet.getRange(4, 17).setValue(sheet.getRange(4, 17).getValue() + 1);
    updateCell = true;
  }

  if (updateCell)
  {
    sheet.getRange(6, 17).setValue("0:00:00");
    sheet.getRange(8, 17).setValue(lastRow);

    var level = sheet.getRange(4, 17).getValue();
    var handicap = sheet.getRange(5, 17).getValue();
    var oldRate =  sheet.getRange(lastRow, 11).getValue() / sheet.getRange(4, 3).getValue();
    var percentage = 0.8;
    var oldMultiplier = 1 / oldRate;

    var newMultiplier = (oldMultiplier*2) + percentage*(oldMultiplier-oldMultiplier*2);

    sheet.getRange(4, 3).setValue(newMultiplier);
    sheet.getRange(lastRow, 18).setValue(level);
    sheet.getRange(lastRow, 19).setValue(handicap);
    SpreadsheetApp.flush();
    Utilities.sleep(250); 
    sheet.getRange(6, 17).setValue(formatDuration2(sheet.getRange(lastRow, 8).getValue() - initialDate));

  }
  //Needs to be here or potential error. 
  // Need to return variables level and handicap
  return [sheet.getRange(4, 17).getValue(),sheet.getRange(5, 17).getValue()];
}

function fetchStats(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  return [sheet.getRange(4, 17).getValue(),sheet.getRange(5, 17).getValue()]
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var initialDate = new Date(1899, 11, 30);
  
  var timeLeft = new Date(sheet.getRange(lastRow + 1, 3).getValue());
  var timeLeftFormatted = formatDuration(timeLeft- initialDate);

  var totalTimeLeft = new Date(sheet.getRange(lastRow, 8).getValue());
  var totalTimeLeftFormatted = formatDuration(totalTimeLeft- initialDate);

  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;

  //Finding % progress
  var currentProgress = Math.floor((sheet.getRange(lastRow, 8).getValue() - initialDate) / (sheet.getRange(7, 17).getValue() - initialDate)*100);
  var maxProgress = Math.floor((sheet.getRange(9, 17).getValue() - initialDate) / (sheet.getRange(7, 17).getValue() - initialDate)*100);

  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }

  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp+storedValueDuration;
    var duration = formatDuration(durationMs);

    var timeLeftDuration = formatDuration(timeLeft - initialDate - durationMs);
    var totalTimeDuration = formatDuration(totalTimeLeft - initialDate + (timeLeft - initialDate - durationMs)+segment);

    return [duration, timeLeftDuration,totalTimeDuration, currentProgress, maxProgress];
  } else {
    return ['00:00:00', timeLeftFormatted, totalTimeLeftFormatted, currentProgress, maxProgress]; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton, #timeButton, #multiplierButton, #startButton, #storeButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      #multiplierButton{
        left: 20px;
        right: auto;
        //right: 100px;
      }
      #timeButton {
        bottom: 60px;
      }
      #startButton {
        left: 20px;
        right: auto;
        bottom: 60px;
      }
      #storeButton {
        bottom: 100px;
      }
      .pressed {
        opacity: 0.5;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
      .cellPace {
        font-size: 20px;
        font-weight: bold;
        display: inline-block;
        margin-right: 10px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Duration</button>
    <button id="multiplierButton" onclick="calculateMultiplier()">Adjust Speed</button>
    <button id="startButton" onclick="showStartTime()">Start</button>
    <button id="storeButton" onclick="storeTime()">Store</button>

    <div id="level" class="cellPace">Level: ...</div>
    <div id="handicap" class="cellPace">Delay: ...</div>

    <div id="percentProgress" class="cellValue">Progress: 0% Max: 0%</div>

    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="timeLeft" class="cellValue">Time Left: 00:00:00</div>
    <div id="totalTimeLeft" class="cellValue">Total Time Left: 00:00:00</div>

    <div id="cellValueP2" class="cellValue">...</div>
    <div>Goal End Time</div>
    <div id="cellValueQ2" class="cellValue">...</div>
    <div>Time Left</div>
    <div id="cellValueL2" class="cellValue">...</div>
    <div>Time Ahead</div>
    <div id="cellValueN2" class="cellValue">...</div>
    <div>Current End Time</div>

    <div id="cellLoading" class="cellValue">Loading</div>

    <script>
      function logTime() {
        showLoading();
        pressButton('floatingButton');
        
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: 00:00:00';
        timeLeftDiv.style.color = 'black';

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: 00:00:00';
        totalTimeLeftDiv.style.color = 'black';
        
        google.script.run.withSuccessHandler(showComplete).logTime();
      }

      function showCurrentDuration() {
        showLoading();
        pressButton('timeButton');
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function showStartTime(){
        showLoading();
        pressButton('startButton');
        google.script.run.withSuccessHandler(showComplete).startTime();
      }

      function storeTime(){
        showLoading();
        pressButton('storeButton');
        google.script.run.withSuccessHandler(showPaused).storeTimeSegment();
      }

      function showLoading(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Loading";
        cellValueDiv.style.color = 'red';
      }

      function showComplete(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Ready";
        cellValueDiv.style.color = 'green';
      }

      function showPaused(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Paused";
        cellValueDiv.style.color = 'orange';
      }

      function calculateMultiplier(){
        pressButton('multiplierButton');
        showLoading();
        google.script.run.withSuccessHandler(displayStats).calculateMultiplier();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration[0];

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: ' + duration[1];

        if (duration[1].startsWith('-')) {
          timeLeftDiv.style.color = 'red';
        } else {
          timeLeftDiv.style.color = 'green';
        }

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: ' + duration[2];

        if (duration[2].startsWith('-')) {
          totalTimeLeftDiv.style.color = 'red';
        } else {
          totalTimeLeftDiv.style.color = 'green';
        }

        var currentProgress = document.getElementById('percentProgress');
        currentProgress.textContent = 'Progress: ' + duration[3] + '% Max: ' + duration[4] + '%';

        showComplete();
      }

      function startGame(){
        showLoading();
        google.script.run.withSuccessHandler(displayStats).fetchStats();
      }

      function displayStats(stats){
        var cellValueLevel = document.getElementById('level');
        var cellValueHandicap = document.getElementById('handicap');

        cellValueLevel.textContent = "Level: " + stats[0];
        cellValueHandicap.textContent = "Delay: " + stats[1];

        showComplete();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'green';
        } else {
          cellValueDivQ2.style.color = 'red';
        }
      }

      function pressButton(buttonId) {
        var button = document.getElementById(buttonId);
        button.classList.add('pressed');
        setTimeout(function() {
          button.classList.remove('pressed');
        }, 200);
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = startGame;
    </script>
  </body>
</html>
```
#### Description
- Trying to keep up at least 80% of my studying speed
- Removed stacking for being 20 minutes ahead
	- Modified it so that I can adjust the speed whenever appropriate
- Added a "store" button for better interruptions. Can use "store" multiple times on the same segment (as long as you press "start" afterwards)
	- Fixed the "duration" and "log time" sections to fix this
- If Level = 0, then delay will not increase when adjusting speed. My initial speed was too quick to follow-through with. 
- Made it so "Level" and "Delay" are on the same level
- Added Progress % and maximum % to aim my goal towards
	- Downside is that the initial "Duration" button is a little slower. We'll just try to avoid that a little
![[Screenshot 2024-12-17 at 6.59.06 AM.png|200]]
- Later installments remove the Progress and Pace calculations

### Solution 9
#### MyScript.gs
```javascript
var segment = 1200000; //20 minutes
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Time Tracking')
    .addItem('Timers', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Timers');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  var initialDate = new Date(1899, 11, 30);
  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;
  
  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp + storedValueDuration;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  var level = sheet.getRange(4, 17).getValue();
  var handicap = sheet.getRange(5, 17).getValue();

  sheet.getRange(lastRow+1, 18).setValue(level);
  sheet.getRange(lastRow+1, 19).setValue(handicap);

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function startTime(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = getLastRowInColumn(16)
  var timestamp = new Date();

  if (lastRow == 3){
    sheet.getRange(lastRow + 1, 16).setValue(timestamp);
  }
  else
  {
    sheet.getRange(lastRow, 16).setValue(timestamp);
  }
  return 
}

function storeTimeSegment(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  
  var initialDate = new Date(1899, 11, 30);
  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;
  
  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }
  
  var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
  var currentTimestamp = new Date();
  
  var durationMs = currentTimestamp - prevTimestamp + storedValueDuration;
  var duration = formatDuration(durationMs);

  sheet.getRange(lastRow + 1, 21).setValue(duration);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS, handles negative durations
function formatDuration(durationMs) {
  var isNegative = durationMs < 0;
  var totalSeconds = Math.abs(Math.floor(durationMs / 1000));
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

function getCellValue(cell) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Main');
  sheet.getRange("T6").setValue(1);
  var value = sheet.getRange(cell).getDisplayValue();
  return value.toString();
}


// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('T8');
  cellValues.L2 = getCellValue('T10');
  cellValues.Q2 = getCellValue('T12');
  cellValues.N2 = getCellValue('T14');
  return cellValues;
}

function pad2(number, digits = 2) {
  return number.toString().padStart(digits, '0');
}

// Helper function to format duration in HH:MM:SS.mmm, handles negative durations
function formatDuration2(durationMs) {
  var isNegative = durationMs < 0;
  var totalMilliseconds = Math.abs(durationMs);
  var totalSeconds = Math.floor(totalMilliseconds / 1000);
  var milliseconds = Math.floor(totalMilliseconds % 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds) + '.' + pad2(milliseconds, 3);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}


function calculateMultiplier() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var initialDate = new Date(1899, 11, 30);
  var updateCell = false;

  var lastRow = getLastRowInColumn(8)
  var difference = sheet.getRange(lastRow, 8).getValue();
  
  var differenceMs = difference - initialDate; //Format is in terms of milliseconds

  if(differenceMs < 0){
    if (sheet.getRange(4, 17).getValue() != 0)
    {
      sheet.getRange(5, 17).setValue(sheet.getRange(5, 17).getValue() + 1);
    }
    updateCell = true;
  }
  else if (differenceMs >= 0){
    sheet.getRange(4, 17).setValue(sheet.getRange(4, 17).getValue() + 1);
    updateCell = true;
  }

  if (updateCell)
  {
    sheet.getRange(6, 17).setValue("0:00:00");
    sheet.getRange(8, 17).setValue(lastRow);

    var level = sheet.getRange(4, 17).getValue();
    var handicap = sheet.getRange(5, 17).getValue();
    var oldRate =  sheet.getRange(lastRow, 11).getValue() / sheet.getRange(4, 3).getValue();
    var percentage = 0.8;
    var oldMultiplier = 1 / oldRate;

    var newMultiplier = (oldMultiplier*2) + percentage*(oldMultiplier-oldMultiplier*2);

    sheet.getRange(4, 3).setValue(newMultiplier);
    sheet.getRange(lastRow, 18).setValue(level);
    sheet.getRange(lastRow, 19).setValue(handicap);
    SpreadsheetApp.flush();
    Utilities.sleep(250); 
    sheet.getRange(6, 17).setValue(formatDuration2(sheet.getRange(lastRow, 8).getValue() - initialDate));

  }
  //Needs to be here or potential error. 
  // Need to return variables level and handicap
  return [sheet.getRange(4, 17).getValue(),sheet.getRange(5, 17).getValue()];
}

function fetchStats(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  return [sheet.getRange(4, 17).getValue(),sheet.getRange(5, 17).getValue()]
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var initialDate = new Date(1899, 11, 30);
  
  var timeLeft = new Date(sheet.getRange(lastRow + 1, 3).getValue());
  var timeLeftFormatted = formatDuration(timeLeft- initialDate);

  var totalTimeLeft = new Date(sheet.getRange(lastRow, 8).getValue());
  var totalTimeLeftFormatted = formatDuration(totalTimeLeft- initialDate);

  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;

  //Finding % progress
  var currentProgress = Math.floor((sheet.getRange(lastRow, 8).getValue() - initialDate) / (sheet.getRange(7, 17).getValue() - initialDate)*100);
  var maxProgress = Math.floor((sheet.getRange(9, 17).getValue() - initialDate) / (sheet.getRange(7, 17).getValue() - initialDate)*100);

  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }

  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp+storedValueDuration;
    var duration = formatDuration(durationMs);

    var timeLeftDuration = formatDuration(timeLeft - initialDate - durationMs);
    var totalTimeDuration = formatDuration(totalTimeLeft - initialDate + (timeLeft - initialDate - durationMs)+segment);

    return [duration, timeLeftDuration,totalTimeDuration, currentProgress, maxProgress];
  } else {
    return ['00:00:00', timeLeftFormatted, totalTimeLeftFormatted, currentProgress, maxProgress]; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton, #timeButton, #multiplierButton, #startButton, #storeButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      #multiplierButton{
        left: 20px;
        right: auto;
        //right: 100px;
      }
      #timeButton {
        bottom: 60px;
      }
      #startButton {
        left: 20px;
        right: auto;
        bottom: 60px;
      }
      #storeButton {
        bottom: 100px;
      }
      .pressed {
        opacity: 0.5;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
      .cellPace {
        font-size: 20px;
        font-weight: bold;
        display: inline-block;
        margin-right: 10px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Duration</button>
    <button id="multiplierButton" onclick="calculateMultiplier()">Adjust Speed</button>
    <button id="startButton" onclick="showStartTime()">Start</button>
    <button id="storeButton" onclick="storeTime()">Store</button>

    <div id="level" class="cellPace">Level: ...</div>
    <div id="handicap" class="cellPace">Delay: ...</div>

    <div id="percentProgress" class="cellValue">Progress: 0% Max: 0%</div>

    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="timeLeft" class="cellValue">Time Left: 00:00:00</div>
    <div id="totalTimeLeft" class="cellValue">Total Time Left: 00:00:00</div>

    <div id="cellValueN2" class="cellValue">...</div>
    <div>Current End Time</div>
    <div id="cellValueL2" class="cellValue">...</div>
    <div>Time Ahead</div>
    <div id="cellValueQ2" class="cellValue">...</div>
    <div>Time Left</div>
    <div id="cellValueP2" class="cellValue">...</div>
    <div>Goal End Time</div>
    

    <div id="cellLoading" class="cellValue">Loading</div>

    <script>
      function logTime() {
        showLoading();
        pressButton('floatingButton');
        
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: 00:00:00';
        timeLeftDiv.style.color = 'black';

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: 00:00:00';
        totalTimeLeftDiv.style.color = 'black';
        
        google.script.run.withSuccessHandler(showComplete).logTime();
      }

      function showCurrentDuration() {
        showLoading();
        pressButton('timeButton');
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function showStartTime(){
        showLoading();
        pressButton('startButton');
        google.script.run.withSuccessHandler(showComplete).startTime();
      }

      function storeTime(){
        showLoading();
        pressButton('storeButton');
        google.script.run.withSuccessHandler(showPaused).storeTimeSegment();
      }

      function showLoading(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Loading";
        cellValueDiv.style.color = 'red';
      }

      function showComplete(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Ready";
        cellValueDiv.style.color = 'green';
      }

      function showPaused(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Paused";
        cellValueDiv.style.color = 'orange';
      }

      function calculateMultiplier(){
        pressButton('multiplierButton');
        showLoading();
        google.script.run.withSuccessHandler(displayStats).calculateMultiplier();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration[0];

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: ' + duration[1];

        if (duration[1].startsWith('-')) {
          timeLeftDiv.style.color = 'red';
        } else {
          timeLeftDiv.style.color = 'green';
        }

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: ' + duration[2];

        if (duration[2].startsWith('-')) {
          totalTimeLeftDiv.style.color = 'red';
        } else {
          totalTimeLeftDiv.style.color = 'green';
        }

        var currentProgress = document.getElementById('percentProgress');
        currentProgress.textContent = 'Progress: ' + duration[3] + '% Max: ' + duration[4] + '%';

        showComplete();
      }

      function startGame(){
        showLoading();
        google.script.run.withSuccessHandler(displayStats).fetchStats();
      }

      function displayStats(stats){
        var cellValueLevel = document.getElementById('level');
        var cellValueHandicap = document.getElementById('handicap');

        cellValueLevel.textContent = "Level: " + stats[0];
        cellValueHandicap.textContent = "Delay: " + stats[1];

        showComplete();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'green';
        } else {
          cellValueDivQ2.style.color = 'red';
        }
      }

      function pressButton(buttonId) {
        var button = document.getElementById(buttonId);
        button.classList.add('pressed');
        setTimeout(function() {
          button.classList.remove('pressed');
        }, 200);
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = startGame;
    </script>
  </body>
</html>
```

#### Description
- Added times for completion (although selecting duration button is slow)

### Solution 10
#### MyScript.gs
```javascript
var segment = 1200000; //20 minutes
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Time Tracking')
    .addItem('Timers', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Timers');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  var initialDate = new Date(1899, 11, 30);
  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;
  
  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp + storedValueDuration;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  var level = sheet.getRange(4, 17).getValue();
  var handicap = sheet.getRange(5, 17).getValue();

  sheet.getRange(lastRow+1, 18).setValue(level);
  sheet.getRange(lastRow+1, 19).setValue(handicap);

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function startTime(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = getLastRowInColumn(16)
  var timestamp = new Date();

  if (lastRow == 3){
    sheet.getRange(lastRow + 1, 16).setValue(timestamp);
  }
  else
  {
    sheet.getRange(lastRow, 16).setValue(timestamp);
  }
  return 
}

function storeTimeSegment(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  
  var initialDate = new Date(1899, 11, 30);
  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;
  
  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }
  
  var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
  var currentTimestamp = new Date();
  
  var durationMs = currentTimestamp - prevTimestamp + storedValueDuration;
  var duration = formatDuration(durationMs);

  sheet.getRange(lastRow + 1, 21).setValue(duration);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS, handles negative durations
function formatDuration(durationMs) {
  var isNegative = durationMs < 0;
  var totalSeconds = Math.abs(Math.floor(durationMs / 1000));
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

function pad2(number, digits = 2) {
  return number.toString().padStart(digits, '0');
}

// Helper function to format duration in HH:MM:SS.mmm, handles negative durations
function formatDuration2(durationMs) {
  var isNegative = durationMs < 0;
  var totalMilliseconds = Math.abs(durationMs);
  var totalSeconds = Math.floor(totalMilliseconds / 1000);
  var milliseconds = Math.floor(totalMilliseconds % 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  // Format the duration
  var formatted = pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds) + '.' + pad2(milliseconds, 3);

  // Add minus sign if the duration is negative
  return isNegative ? '-' + formatted : formatted;
}

function updateReward(reward,multiplier)
{
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Main');

  temp = sheet.getRange("T6").getValue()
  temp2 = sheet.getRange("S2").getValue()

  if (temp === ""){
    temp = 0;
  }
  else
  {
    temp = temp - new Date(1899, 11, 30);
  }

  if (temp2 === ""){
    temp2 = 0;
  }
  else
  {
    temp2 = temp2 - new Date(1899, 11, 30);
  }
  
  sheet.getRange("S2").setValue(formatDuration(temp2 + reward));
  sheet.getRange("T6").setValue(formatDuration(temp + multiplier));
}

function calculateMultiplier() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var sheet2Reward = sheet.getRange("Q10").getValue() - new Date(1899, 11, 30);
  var sheet2Multiplier = sheet.getRange("Q11").getValue() - new Date(1899, 11, 30);

  var initialDate = new Date(1899, 11, 30);
  var updateCell = false;

  var lastRow = getLastRowInColumn(8)
  var difference = sheet.getRange(lastRow, 8).getValue();
  
  var differenceMs = difference - initialDate; //Format is in terms of milliseconds

  if(differenceMs < 0){
    if (sheet.getRange(4, 17).getValue() != 0)
    {
      sheet.getRange(5, 17).setValue(sheet.getRange(5, 17).getValue() + 1);
    }
    updateCell = true;
  }
  else if (differenceMs >= 0){
    sheet.getRange(4, 17).setValue(sheet.getRange(4, 17).getValue() + 1);
    updateCell = true;
  }

  if (updateCell)
  {
    sheet.getRange(6, 17).setValue("0:00:00");
    sheet.getRange(8, 17).setValue(lastRow);

    var level = sheet.getRange(4, 17).getValue();
    var handicap = sheet.getRange(5, 17).getValue();
    var oldRate =  sheet.getRange(lastRow, 11).getValue() / sheet.getRange(4, 3).getValue();
    var percentage = 0.8;
    var oldMultiplier = 1 / oldRate;

    var newMultiplier = (oldMultiplier*2) + percentage*(oldMultiplier-oldMultiplier*2);

    sheet.getRange(4, 3).setValue(newMultiplier);
    sheet.getRange(lastRow, 18).setValue(level);
    sheet.getRange(lastRow, 19).setValue(handicap);
    SpreadsheetApp.flush();
    Utilities.sleep(250); 
    sheet.getRange(6, 17).setValue(formatDuration2(sheet.getRange(lastRow, 8).getValue() - initialDate));

  }

  // Placed at end of function as to not mess with "earliest time" formula
  updateReward(sheet2Reward, sheet2Multiplier);

  //Needs to be here or potential error. 
  // Need to return variables level and handicap
  return [sheet.getRange(4, 17).getValue(),sheet.getRange(5, 17).getValue()];
}

function fetchStats(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  return [sheet.getRange(4, 17).getValue(),sheet.getRange(5, 17).getValue()]
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var initialDate = new Date(1899, 11, 30);
  
  var timeLeft = new Date(sheet.getRange(lastRow + 1, 3).getValue());
  var timeLeftFormatted = formatDuration(timeLeft- initialDate);

  var totalTimeLeft = new Date(sheet.getRange(lastRow, 8).getValue());
  var totalTimeLeftFormatted = formatDuration(totalTimeLeft- initialDate);

  var storedValue = sheet.getRange(lastRow+1, 21).getValue();
  var storedValueDuration;

  //Finding % progress
  var currentProgress = Math.floor((sheet.getRange(lastRow, 8).getValue() - initialDate) / (sheet.getRange(7, 17).getValue() - initialDate)*100);
  var maxProgress = Math.floor((sheet.getRange(9, 17).getValue() - initialDate) / (sheet.getRange(7, 17).getValue() - initialDate)*100);

  if (storedValue === ""){
    storedValueDuration = 0;
  }
  else
  {
    storedValueDuration = storedValue - initialDate;
  }

  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp+storedValueDuration;
    var duration = formatDuration(durationMs);

    var timeLeftDuration = formatDuration(timeLeft - initialDate - durationMs);
    var totalTimeDuration = formatDuration(totalTimeLeft - initialDate + (timeLeft - initialDate - durationMs)+segment);

    return [duration, timeLeftDuration,totalTimeDuration, currentProgress, maxProgress];
  } else {
    return ['00:00:00', timeLeftFormatted, totalTimeLeftFormatted, currentProgress, maxProgress]; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton, #timeButton, #multiplierButton, #startButton, #storeButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      #multiplierButton{
        left: 20px;
        right: auto;
        //right: 100px;
      }
      #timeButton {
        bottom: 60px;
      }
      #startButton {
        left: 20px;
        right: auto;
        bottom: 60px;
      }
      #storeButton {
        bottom: 100px;
      }
      .pressed {
        opacity: 0.5;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
      .cellPace {
        font-size: 20px;
        font-weight: bold;
        display: inline-block;
        margin-right: 10px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Duration</button>
    <button id="multiplierButton" onclick="calculateMultiplier()">Adjust Speed</button>
    <button id="startButton" onclick="showStartTime()">Start</button>
    <button id="storeButton" onclick="storeTime()">Store</button>

    <div id="level" class="cellPace">Level: ...</div>
    <div id="handicap" class="cellPace">Delay: ...</div>

    <div id="percentProgress" class="cellValue">Progress: 0% Max: 0%</div>

    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="timeLeft" class="cellValue">Time Left: 00:00:00</div>
    <div id="totalTimeLeft" class="cellValue">Total Time Left: 00:00:00</div>

    <div id="cellLoading" class="cellValue">Loading</div>

    <script>
      function logTime() {
        showLoading();
        pressButton('floatingButton');
        
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: 00:00:00';
        timeLeftDiv.style.color = 'black';

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: 00:00:00';
        totalTimeLeftDiv.style.color = 'black';
        
        google.script.run.withSuccessHandler(showComplete).logTime();
      }

      function showCurrentDuration() {
        showLoading();
        pressButton('timeButton');
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
      }

      function showStartTime(){
        showLoading();
        pressButton('startButton');
        google.script.run.withSuccessHandler(showComplete).startTime();
      }

      function storeTime(){
        showLoading();
        pressButton('storeButton');
        google.script.run.withSuccessHandler(showPaused).storeTimeSegment();
      }

      function showLoading(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Loading";
        cellValueDiv.style.color = 'red';
      }

      function showComplete(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Ready";
        cellValueDiv.style.color = 'green';
      }

      function showPaused(){
        var cellValueDiv = document.getElementById('cellLoading');
        cellValueDiv.textContent = "Paused";
        cellValueDiv.style.color = 'orange';
      }

      function calculateMultiplier(){
        pressButton('multiplierButton');
        showLoading();
        google.script.run.withSuccessHandler(displayStats).calculateMultiplier();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration[0];

        var timeLeftDiv = document.getElementById('timeLeft');
        timeLeftDiv.textContent = 'Time Left: ' + duration[1];

        if (duration[1].startsWith('-')) {
          timeLeftDiv.style.color = 'red';
        } else {
          timeLeftDiv.style.color = 'green';
        }

        var totalTimeLeftDiv = document.getElementById('totalTimeLeft');
        totalTimeLeftDiv.textContent = 'Total Time Left: ' + duration[2];

        if (duration[2].startsWith('-')) {
          totalTimeLeftDiv.style.color = 'red';
        } else {
          totalTimeLeftDiv.style.color = 'green';
        }

        var currentProgress = document.getElementById('percentProgress');
        currentProgress.textContent = 'Progress: ' + duration[3] + '% Max: ' + duration[4] + '%';

        showComplete();
      }

      function startGame(){
        showLoading();
        google.script.run.withSuccessHandler(displayStats).fetchStats();
      }

      function displayStats(stats){
        var cellValueLevel = document.getElementById('level');
        var cellValueHandicap = document.getElementById('handicap');

        cellValueLevel.textContent = "Level: " + stats[0];
        cellValueHandicap.textContent = "Delay: " + stats[1];

        showComplete();
      }

      function pressButton(buttonId) {
        var button = document.getElementById(buttonId);
        button.classList.add('pressed');
        setTimeout(function() {
          button.classList.remove('pressed');
        }, 200);
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = startGame;
    </script>
  </body>
</html>
```
#### Description
- Removed extra statistics
- Added Reward base (for "Main" page)
- Added Time Estimate base (for "Main" page)
## Version 1
### Attempt #1
#### Sidebar.html

^0b6671

```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>

    <script>
      function logTime() {
        google.script.run.logTime();
      }
    </script>
  </body>
</html>

```

#### MyScript.gs

^577e34

```python
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow() + 1;
  var timestamp = new Date();
  sheet.getRange(lastRow, 1).setValue(timestamp);
}
```

#### Result
![[Screenshot 2024-06-12 at 9.28.57 PM.png]]
- Ignore the blue rectangle. That is not part of the script
- When pressing the  `Log Time` button, it will place the date
#### Changes Needed
- The "Floating Button" could be a little smaller
- I would like the output to be a difference in time. 
- It seems like pressing the X button cancels the script so that's good.

### Attempt #2
- Tried to change the width of the "Floating Button", but it didn't work. I actually might be able to insert my own split times in this view though which may be a good idea. Like how much time I have left for each section. That would be pretty fun!

#### Changes Needed
- Let's try to change it so that the time is printed between each button presss

### Attempt #3 

#### MyScript.gs
```python
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 1).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 2).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 1).setValue(timestamp);
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}
```
#### Sidebar.html
- Same as [[(Project) Floating Timer Button in Google Sheets#^0b6671|attempt1]]

#### Results
- Able to calculate the time between two events
- Now just need to not calculate when there is not a date written above and I want them to calculate in a different column (that I can modify)!

### Attempt #4
#### MyScript.gs
```python
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}
```
- This has the correct columns included


## Version 2: Displaying Cell Values
### Why not Cancelled?
- I could just use the freeze view property in google sheets. Otherwise, it would have been more complicated (such as timing the calculations)
	- Going to try again! Honestly worth the work as it allows for more flexibility. Just hopefully the computation doesn't take too long.
### Attempt #1
#### sidebar.html
```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      #cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <div id="cellValue">Loading...</div>

    <script>
      function logTime() {
        google.script.run.logTime();
        updateCellValue();
      }

      function updateCellValue() {
        google.script.run.withSuccessHandler(displayCellValue).fetchCellValue();
      }

      function displayCellValue(value) {
        var cellValueDiv = document.getElementById('cellValue');
        cellValueDiv.textContent = value;

        if (value < 0) {
          cellValueDiv.style.color = 'red';
        } else {
          cellValueDiv.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell value when the sidebar is opened
      window.onload = updateCellValue;
    </script>
  </body>
</html>
```

#### MyScript.gs
```javascript
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from cell B4
function getCellValue() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange('L2').getValue();
  return value.toString();
}

// Function to be called from HTML to fetch and display the cell value
function fetchCellValue() {
  return getCellValue();
}
```

#### Result
- Able to view the duration (Green color looks good)
- Shows the date instead of just the duration which may be a problem. Needs to be interrpreted differently

### Attempt #2
#### html
```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      #cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <div id="cellValue">Loading...</div>

    <script>
      function logTime() {
        google.script.run.logTime();
        updateCellValue();
      }

      function updateCellValue() {
        google.script.run.withSuccessHandler(displayCellValue).fetchCellValue();
      }

      function displayCellValue(value) {
        var cellValueDiv = document.getElementById('cellValue');
        cellValueDiv.textContent = value;

        if (value < 0) {
          cellValueDiv.style.color = 'red';
        } else {
          cellValueDiv.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell value when the sidebar is opened
      window.onload = updateCellValue;
    </script>
  </body>
</html>
```
#### gs
```javascript
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

function getCellValue() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange('L2').getValue();
  
  if (value instanceof Date) {
    // Format the date as HH:MM:SS
    return Utilities.formatDate(value, SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), 'HH:mm:ss');
  } else if (typeof value === 'number') {
    // If the value is a number (assuming it's in decimal days), convert it to HH:MM:SS
    var totalSeconds = Math.round(value * 24 * 60 * 60);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  } else {
    // If it's neither a Date nor a number, return it as is
    return value.toString();
  }
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to be called from HTML to fetch and display the cell value
function fetchCellValue() {
  return getCellValue();
}

```
#### Results
- Still showing the incorrect value. If I have a negative number such as -2 hours, it will just show me 22 hours. It does not indicate negative numbers well unfortunately. Might need to calculate them myself?
- Has a results delay. Need to figure out how to fix that
- The log Time is not working

### Attempt #3
#### Objectives
- I would like to get a proper duration number. However, it interprets the calculation as a date object instead of a duration.
#### MyScript.gs
```javascript
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from cell B4
function getCellValue() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange('L2').getDisplayValue();
  return value.toString();
}

// Function to be called from HTML to fetch and display the cell value
function fetchCellValue() {
  return getCellValue();
}
```
#### Sidebar.html
```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      #cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <div id="MyCell">Baseline Progress</div> <!-- Added text "Test" -->
    <div id="cellValue">Loading...</div>

    <script>
      function logTime() {
        google.script.run.logTime();
        updateCellValue();
      }

      function updateCellValue() {
        google.script.run.withSuccessHandler(displayCellValue).fetchCellValue();
      }

      function displayCellValue(value) {
        var cellValueDiv = document.getElementById('cellValue');
        cellValueDiv.textContent = value;
        if (value.startsWith('-')) {
          cellValueDiv.style.color = 'red';
        } else {
          cellValueDiv.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell value when the sidebar is opened
      window.onload = updateCellValue;
    </script>
  </body>
</html>
```
#### Results
- Positive
	- Color is correct
	- It displays the correct duration
	- Added a title over the name
- Negative
	- The update is delayed
	- Still need to add the other 4 suggestions / numbers
	- Order wanted
		- Progress Minimum
		- Progress Baseline
		- Pace Minimum
		- Pace Baseline

### Attempt #4 

#### MyScript.gs
```javascript
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2');
  cellValues.L2 = getCellValue('L2');
  cellValues.Q2 = getCellValue('Q2');
  cellValues.N2 = getCellValue('N2');
  return cellValues;
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <div id="cellValueP2" class="cellValue">Loading...</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">Loading...</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">Loading...</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">Loading...</div>
    <div>Pace Baseline</div>

    <script>
      function logTime() {
        google.script.run.logTime();
        updateCellValues();
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = updateCellValues;
    </script>
  </body>
</html>

```
#### Results
- Added all four
#### Goal
- Last goal is to make sure it updates correctly 

### Attempt #5
#### MyScript.gs
```javascript
// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell, cell2) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  while (sheet.getRange(cell2).getDisplayValue().toString() == value.toString())
    {
      SpreadsheetApp.flush();
      Utilities.sleep(100); 
      value = sheet.getRange(cell).getDisplayValue();
    }
  sheet.getRange(cell2).setValue(value.toString());
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2', 'U4');
  cellValues.L2 = getCellValue('L2', 'U5');
  cellValues.Q2 = getCellValue('Q2', 'U6');
  cellValues.N2 = getCellValue('N2', 'U7');
  return cellValues;
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <div id="cellValueP2" class="cellValue">Loading...</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">Loading...</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">Loading...</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">Loading...</div>
    <div>Pace Baseline</div>

    <script>
      function logTime() {
        google.script.run.logTime();
        updateCellValues();
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = updateCellValues;
    </script>
  </body>
</html>

```

#### Description
- Works as intended but slow. Takes around 4 seconds for it to work
- Could also fix it so that there is a default value for 4 cells. 

### Attempt #6
#### Approach
- This will help speed up calculations by setting up local variables
- https://developers.google.com/apps-script/guides/properties
	- This will help
## Version 3
### Attempt #1
#### MyScript.gs
```javascript
const scriptProperties = PropertiesService.getScriptProperties();

// This function creates a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Button')
    .addItem('Show Button', 'showSidebar')
    .addToUi();

  scriptProperties.setProperties({
    'ProgressMinimum': 'Null',
    'ProgressBaseline': 'Null',
    'PaceMinimum': 'Null',
    'PaceBaseline': 'Null'
  });
}

// This function shows the sidebar with the floating button
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Floating Button');
  SpreadsheetApp.getUi().showSidebar(html);
}

// This function is triggered by the floating button
function logTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16
  var timestamp = new Date();

  // If this is not the first row, calculate the duration from the previous timestamp
  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var durationMs = timestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    sheet.getRange(lastRow + 1, 6).setValue(duration);
  }

  // Log the current timestamp
  sheet.getRange(lastRow + 1, 16).setValue(timestamp);
}

function getLastRowInColumn(column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, column, sheet.getMaxRows(), 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][0] !== '') {
      return i + 1;
    }
  }
  return 0;
}

// Helper function to format duration in HH:MM:SS
function formatDuration(durationMs) {
  var totalSeconds = Math.floor(durationMs / 1000);
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

// Helper function to pad single digit numbers with a leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Function to get the value from a cell
function getCellValue(cell, oldValue, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var value = sheet.getRange(cell).getDisplayValue();
  while (oldValue == value.toString())
    {
      SpreadsheetApp.flush();
      Utilities.sleep(50); 
      value = sheet.getRange(cell).getDisplayValue();
    }
  scriptProperties.setProperty(key, value.toString());
  return value.toString();
}

// Function to fetch values from multiple cells
function fetchCellValues() {
  var cellValues = {};
  cellValues.P2 = getCellValue('P2', scriptProperties.getProperty('ProgressMinimum'), 'ProgressMinimum');
  cellValues.L2 = getCellValue('L2', scriptProperties.getProperty('ProgressBaseline'), 'ProgressBaseline');
  cellValues.Q2 = getCellValue('Q2', scriptProperties.getProperty('PaceMinimum'), "PaceMinimum");
  cellValues.N2 = getCellValue('N2', scriptProperties.getProperty('PaceBaseline'), 'PaceBaseline');
  return cellValues;
}

// This function calculates the current duration of the segment
function calculateCurrentDuration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = getLastRowInColumn(16);  // Get the last row with data in column 16

  if (lastRow > 0) {
    var prevTimestamp = new Date(sheet.getRange(lastRow, 16).getValue());
    var currentTimestamp = new Date();
    var durationMs = currentTimestamp - prevTimestamp;
    var duration = formatDuration(durationMs);
    return duration;
  } else {
    return '00:00:00'; // If there is no previous timestamp, return 0 duration
  }
}
```
#### Sidebar.html
```HTML
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      #floatingButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      #timeButton {
        position: fixed;
        bottom: 60px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cellValue {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <button id="floatingButton" onclick="logTime()">Log Time</button>
    <button id="timeButton" onclick="showCurrentDuration()">Time</button>
    <div id="currentDuration" class="cellValue">Segment Duration: 00:00:00</div>
    <div id="cellValueP2" class="cellValue">Loading...</div>
    <div>Progress Minimum</div>
    <div id="cellValueL2" class="cellValue">Loading...</div>
    <div>Progress Baseline</div>
    <div id="cellValueQ2" class="cellValue">Loading...</div>
    <div>Pace Minimum</div>
    <div id="cellValueN2" class="cellValue">Loading...</div>
    <div>Pace Baseline</div>

    <script>
      function logTime() {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = `Segment Duration: 00:00:00`;
        google.script.run.logTime();
        updateCellValues();
      }

      function showCurrentDuration() {
        google.script.run.withSuccessHandler(displayCurrentDuration).calculateCurrentDuration();
      }

      function displayCurrentDuration(duration) {
        var currentDurationDiv = document.getElementById('currentDuration');
        currentDurationDiv.textContent = 'Segment Duration: ' + duration;
      }

      function updateCellValues() {
        google.script.run.withSuccessHandler(displayCellValues).fetchCellValues();
      }

      function displayCellValues(values) {
        var cellValueDivP2 = document.getElementById('cellValueP2');
        var cellValueDivL2 = document.getElementById('cellValueL2');
        var cellValueDivQ2 = document.getElementById('cellValueQ2');
        var cellValueDivN2 = document.getElementById('cellValueN2');

        cellValueDivP2.textContent = values.P2;
        cellValueDivL2.textContent = values.L2;
        cellValueDivQ2.textContent = values.Q2;
        cellValueDivN2.textContent = values.N2;

        if (values.P2.startsWith('-')) {
          cellValueDivP2.style.color = 'red';
        } else {
          cellValueDivP2.style.color = 'green';
        }

        if (values.L2.startsWith('-')) {
          cellValueDivL2.style.color = 'red';
        } else {
          cellValueDivL2.style.color = 'green';
        }

        if (values.Q2.startsWith('-')) {
          cellValueDivQ2.style.color = 'red';
        } else {
          cellValueDivQ2.style.color = 'green';
        }

        if (values.N2.startsWith('-')) {
          cellValueDivN2.style.color = 'red';
        } else {
          cellValueDivN2.style.color = 'green';
        }
      }

      // Initial call to fetch and display the cell values when the sidebar is opened
      window.onload = updateCellValues;
    </script>
  </body>
</html>

```
### Attempt #2
#### Goal
- I could save the value of the date and then use that stored value to make the calculation rather than needing to wait a little longer. I guess I could do this? Just need to figure out how to convert it into the correct format.
### Goal
- Add an extra button called "time" which calculates the current duration of this segment and displays it in the side panel (instead of in one of the cells of the sheet). This was completed!

## Version 4: Adding "Time Left" for each Section
### Objective
- Add a "Time Left" to know how much time according to the duration is left. If it's < than time left, it will turn red. Otherwise, it will remain green! 
## Adding Easy Log Option
- Side panel (calculate the values in it)
	- Too large
		- Unable to adjust size
		- Blocks the time left above
- <mark style="background: #FF5582A6;">Modal Dialogue</mark>
	- It's just a pop-up
- <mark style="background: #FF5582A6;">Button</mark>
	- Even though it can stay in a row where it is frozen, if I click on it, the sheet scrolls to the location of the button
- Having button in menu bar?
	- The "running" thing is annoying. I would like to avoid anything else entering by brain as much as possible
	- Seems like it will always need to be a two step process?
- <mark style="background: #FFB86CA6;">Moving around the Cells</mark>
	- Seems like this is the best option
	- However, I might need to do that for a future date. Plus, it kind of makes the view a little more claustrophobic. What if I want to see something else at the bottom? Definitely going to go the script route. I just hope it doesn't take too long to update (maybe a second maximum?) Sounds good!
- <mark style="background: #BBFABBA6;">Displaying value by calculating them again (side panel)</mark>
	- Might be too much work / calculations that need to be done? Might honestly be a decent option
	- Would need to learn how to sync them though. I think it would be worth the time and effort. I also thin it would be better than just changing what we currently have. Plus, it would be super easy just changing the layout as opposed to needing to shift the top again
	- Might want to add how many hours total there are as well. Sounds good! Worth the extra half second of wait hopefully. Just comparing if time changed. If it did, then we continue, if not, then we cut our losses.
- Keyboard shortcuts?
	- Doesn't seem possible either. 