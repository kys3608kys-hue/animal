function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 시트에 데이터가 없으면 자동으로 헤더(첫 줄) 추가
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["기록일시", "참가자", "정답 수", "오답 수", "상세 기록"]);
  }
  
  // index.html의 fetch에서 보낸 데이터(e.parameter)를 변수에 저장
  var name = e.parameter.name;
  var correct = e.parameter.correct;
  var wrong = e.parameter.wrong;
  var details = e.parameter.details || "기록 없음";
  
  // 한국 시간 기준으로 예쁘게 포맷
  var date = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
  
  // 시트의 마지막 줄에 새로운 결과 추가
  sheet.appendRow([date, name, correct, wrong, details]);
  
  // 성공적으로 처리되었음을 응답 (CORS 환경에서 직접 읽지는 못하더라도 정상 종료를 위해)
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
