function arrumarEnumeracaoFaxina() {
  var body = DocumentApp.getActiveDocument().getBody();
  var elements = body.getNumChildren();

  var h1Counter = 0;
  var h2Counter = 0;

  for (var i = 0; i < elements; i++) {
    var element = body.getChild(i);

    // Ignora o sumário para não quebrar os links
    if (element.getType() === DocumentApp.ElementType.TABLE_OF_CONTENTS) {
      continue;
    }

    var isParagraph = element.getType() === DocumentApp.ElementType.PARAGRAPH;
    var isListItem = element.getType() === DocumentApp.ElementType.LIST_ITEM;

    if (isParagraph || isListItem) {
      // Se for um item de lista (com numeração automática), removemos essa propriedade
      // Isso transforma o título de volta em um parágrafo limpo.
      var p = isParagraph ? element.asParagraph() : element.asListItem();
      
      var heading = p.getHeading();
      
      if (heading === DocumentApp.ParagraphHeading.HEADING1 || heading === DocumentApp.ParagraphHeading.HEADING2) {
        
        if (isListItem) {
          p = p.removeFromList();
        }

        var textStr = p.getText();
        if (textStr.trim() === "") continue;

        // Expressão Regular Mágica: encontra QUALQUER sequência de números no início,
        // mesmo que estejam duplicados por erro (ex: "17. 17. " ou "16.1. 16.1. ").
        var match = textStr.match(/^(\d+(?:\.\d+)*\.?\s*)+/);
        
        var textObj = p.editAsText();
        
        // Apaga a sujeira dos números antigos preservando a formatação (negrito, fonte, etc)
        if (match) {
          textObj.deleteText(0, match[0].length - 1);
        }

        // Calcula a numeração correta e insere
        if (heading === DocumentApp.ParagraphHeading.HEADING1) {
          h1Counter++;
          h2Counter = 0; // zera o H2 a cada novo H1
          textObj.insertText(0, h1Counter + ". ");
        } 
        else if (heading === DocumentApp.ParagraphHeading.HEADING2) {
          h2Counter++;
          textObj.insertText(0, h1Counter + "." + h2Counter + ". ");
        }
      }
    }
  }
}
