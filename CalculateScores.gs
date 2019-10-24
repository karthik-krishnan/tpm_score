var metadataJsonFileId = "1XkzYzphmtfkYMAX2la5PBbsT7YlBYAdP"
var data = DriveApp.getFileById(metadataJsonFileId).getBlob().getDataAsString();
var metadataJson = JSON.parse(data);
var q_r_map = {};

function calculateScores() {
//  var sheetUrl = "https://docs.google.com/spreadsheets/d/1PQllj7ZHBF50pTxxp1xY9CMCSeWF4Ob7SjBP4_Toar0/edit";  
//  var sheet = SpreadsheetApp.getopenByUrl(sheetUrl);
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var current_row = sheet.getCurrentCell().getRow()
  var questions = sheet.getSheetByName("Form Responses 1").getRange(1,2,1,6).getValues()[0];
  var responses = sheet.getSheetByName("Form Responses 1").getRange(current_row,2,1,6).getValues()[0];
  var summary_sheet_name = responses[0];
  var score_details_sheet = sheet.getSheetByName(summary_sheet_name) || sheet.insertSheet().setName(summary_sheet_name);
  for(i=1;i<questions.length;i++) {
    q_r_map[questions[i]] = responses[i];
  }
  var score = {};
  var sections = metadataJson["sections"];
   for (n=0;n<sections.length;n++) {
     var questions = sections[n]["questions"] || [];
     score[sections[n]["section"]] = calculateScoreOnItems(questions);
   }
  score_details_sheet.getRange(1,1).setValue("Category");
  score_details_sheet.getRange(1,2).setValue("Score");
  var row = 2;
  
  for(i=0;i<Object.keys(score).length;i++) {
    score_details_sheet.getRange(row,1).setValue(Object.keys(score)[i]);
    score_details_sheet.getRange(row,2).setValue(score[Object.keys(score)[i]]);
    row++;
  }
   
}

function calculateScoreOnItems(items) {
  var total = 0;
  for (i=0;i<items.length;i++) {
    var item = items[i];
    total += calculateScoreOnItem(item);
  }
  return (total/items.length).toFixed(2);
}

function calculateScoreOnItem(item) {
  return item["options"].indexOf(q_r_map[item["question"]]) + 1;
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Custom Menu')
      .addItem('Calculate Scores', 'calculateScores')
      .addToUi();
}
