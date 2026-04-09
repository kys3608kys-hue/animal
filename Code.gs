function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 시트에 데이터가 없으면 자동으로 헤더(첫 줄) 추가
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["기록일시", "참가자", "조건(글자 수)", "제시 자극", "정답 반응", "참가자 반응", "정오 여부", "반응시간(RT)", "1글자 평균RT", "2글자 평균RT", "3글자 평균RT"]);
  }
  
  var name = e.parameter.name;
  var trialsStr = e.parameter.trials;
  
  // 한국 시간 기준으로 예쁘게 포맷
  var date = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
  
  if (trialsStr) {
    try {
      var trials = JSON.parse(trialsStr);
      // 각 시행별로 한 줄씩 데이터 추가
      for (var i = 0; i < trials.length; i++) {
        var t = trials[i];
        // 평균값이 없으면 0으로 표시되도록 안전장치 마련
        var avg1 = t.avg1 || 0;
        var avg2 = t.avg2 || 0;
        var avg3 = t.avg3 || 0;
        sheet.appendRow([date, name, t.condition || "없음", t.stimulus, t.expected, t.response, t.isCorrect, t.rt, avg1, avg2, avg3]);
      }
    } catch(err) {
      sheet.appendRow([date, name, "에러", "데이터 파싱 에러", "", "", "", "", "", "", ""]);
    }
  } else {
    // 기존 데이터 형식으로 들어오는 경우 예외 처리
    var correct = e.parameter.correct;
    var wrong = e.parameter.wrong;
    var details = e.parameter.details || "기록 없음";
    sheet.appendRow([date, name, "기록 형식 다름", "정답:" + correct, "오답:" + wrong, details, "", "", "", "", ""]);
  }
  
  // 성공적으로 처리되었음을 응답
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
