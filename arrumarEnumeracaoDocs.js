function converterTitulosParaHeading3() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var paragraphs = body.getParagraphs();
  
  // Padrão: um ou mais dígitos, ponto, espaço(s), um ou mais dígitos, espaço
  var padrao = /^\d+\.\s*\d+\s/;
  
  var contador = 0;
  
  paragraphs.forEach(function(paragraph) {
    var texto = paragraph.getText();
    
    if (padrao.test(texto)) {
      paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING3);
      contador++;
    }
  });
  
  Logger.log(contador + " parágrafo(s) convertido(s) para Heading 3.");
  DocumentApp.getUi().alert(contador + " título(s) convertido(s) para Heading 3.");
}
