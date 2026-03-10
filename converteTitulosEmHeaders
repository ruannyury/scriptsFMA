function converterTitulosParaHeaders() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const totalParagraphs = body.getNumChildren();

  // Regex patterns para cada nível de título
  const patterns = [
    // Nível 4: 1.1.1.1
    { regex: /^\d+\.\d+\.\d+\.\d+[\s\.\)]/,  heading: DocumentApp.ParagraphHeading.HEADING4 },
    // Nível 3: 1.1.1
    { regex: /^\d+\.\d+\.\d+[\s\.\)]/,        heading: DocumentApp.ParagraphHeading.HEADING3 },
    // Nível 2: 1.1
    { regex: /^\d+\.\d+[\s\.\)]/,             heading: DocumentApp.ParagraphHeading.HEADING2 },
    // Nível 1: 1.
    { regex: /^\d+[\.\)]\s/,                  heading: DocumentApp.ParagraphHeading.HEADING1 },
  ];

  let convertidos = 0;

  for (let i = 0; i < totalParagraphs; i++) {
    const child = body.getChild(i);

    // Ignorar elementos que não são parágrafos
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;

    const paragraph = child.asParagraph();
    const text = paragraph.getText().trim();

    if (!text) continue;

    // Testar do padrão mais específico para o mais genérico
    for (const { regex, heading } of patterns) {
      if (regex.test(text)) {
        paragraph.setHeading(heading);
        convertidos++;
        break;
      }
    }
  }

  DocumentApp.getUi().alert(`✅ Concluído! ${convertidos} título(s) convertido(s) em headers.`);
}

// Adiciona um menu personalizado ao abrir o documento
function onOpen() {
  DocumentApp.getUi()
    .createMenu('🔧 Ferramentas Personalizadas')
    .addItem('Converter Títulos em Headers', 'converterTitulosParaHeaders')
    .addToUi();
}
