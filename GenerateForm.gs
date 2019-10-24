var formId = "1I_MDFvRj4wnpC35NGVacMWWn-DUZuftLGRJ6Hc4n8O0";  
var form = FormApp.openById(formId);

function myFunction() {  
   var metadataJsonFileId = "1XkzYzphmtfkYMAX2la5PBbsT7YlBYAdP" //Real One
//   var metadataJsonFileId = "1gBQ9erwZBuhO6BsmtT-bSb5eKUUxM40q" //Test
   
   var data = DriveApp.getFileById(metadataJsonFileId).getBlob().getDataAsString();
   var metadataJson = JSON.parse(data);
  
   form.setTitle(metadataJson["title"]).setDescription(metadataJson["description"]);  

   form.getItems().forEach(function(item) {
      form.deleteItem(item);
   });

   var questions = metadataJson["questions"];
   processItems(questions);
   
   var sections = metadataJson["sections"];
   for (n=0;n<sections.length;n++) {
     form.addPageBreakItem().setTitle(sections[n]["section"]);
     var questions = sections[n]["questions"] || [];
     processItems(questions);
   }
 }
 
 function processItems(items) {
   for (i=0;i<items.length;i++) {
     var item = items[i];
     processItem(item);
   }
 }
 
 function processItem(item) {
   if(item["type"] == "text")
     form.addTextItem().setTitle(item["question"]).setRequired(true);
   else if(item["type"] == "multi_choice")
     form.addMultipleChoiceItem().setTitle(item["question"]).setChoiceValues(item["options"]).setRequired(true).setHelpText(item["description"]);
   else if(item["type"] == "multi_choice_grid")
     form.addGridItem().setTitle(item["question"]).setRows(item["sub_questions"]).setColumns(item["options"]).setRequired(true).setHelpText(item["description"])
 }