/**
 * Adiciona um menu personalizado quando o documento é aberto.
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('Estrutura do documento')
    .addItem(
      'Aplicar headings pela numeração',
      'aplicarHeadingsPorNumeracao'
    )
    .addToUi();
}


/**
 * Analisa os parágrafos da guia ativa do Google Docs
 * e aplica headings conforme a numeração encontrada.
 *
 * Exemplos:
 * 1. Título              -> Heading 2
 * 1.1 Título             -> Heading 3
 * 1.1. Título            -> Heading 3
 * 1.1.1 Título           -> Heading 4
 * 1.1.1.1 Título         -> Heading 5
 * 1.1.1.1.1 Título       -> Heading 6
 */
function aplicarHeadingsPorNumeracao() {
  const documento = DocumentApp.getActiveDocument();

  // Trabalha com a guia atualmente aberta no Google Docs.
  const corpo = documento
    .getActiveTab()
    .asDocumentTab()
    .getBody();

  const paragrafos = corpo.getParagraphs() || [];

  const headings = {
    2: DocumentApp.ParagraphHeading.HEADING2,
    3: DocumentApp.ParagraphHeading.HEADING3,
    4: DocumentApp.ParagraphHeading.HEADING4,
    5: DocumentApp.ParagraphHeading.HEADING5,
    6: DocumentApp.ParagraphHeading.HEADING6
  };

  let quantidadeFormatada = 0;
  let quantidadeIgnorada = 0;

  /*
   * A expressão reconhece:
   *
   * 1. Título
   * 1.1 Título
   * 1.1. Título
   * 1.1.1 Título
   * 1.1.1. Título
   *
   * Não reconhece:
   *
   * 1 Título
   * Exemplo 1.1
   * 1.
   */
  const padraoNumeracao =
    /^\s*(\d+(?:\.\d+)+(?:\.)?|\d+\.)\s+\S.*$/;

  paragrafos.forEach(function (paragrafo) {
    const texto = paragrafo.getText();

    if (!texto || !texto.trim()) {
      return;
    }

    /*
     * Evita modificar listas numeradas automáticas.
     * Retire este bloco caso também queira processar
     * itens de listas do Google Docs.
     */
    if (
      paragrafo.getType() ===
      DocumentApp.ElementType.LIST_ITEM
    ) {
      quantidadeIgnorada++;
      return;
    }

    const correspondencia = texto.match(padraoNumeracao);

    if (!correspondencia) {
      return;
    }

    /*
     * Remove o ponto final da numeração:
     *
     * "1."     vira "1"
     * "1.1."   vira "1.1"
     * "1.1.1." vira "1.1.1"
     */
    const numeracao = correspondencia[1].replace(/\.$/, '');

    const profundidade = numeracao.split('.').length;

    /*
     * A regra solicitada desloca o nível em uma posição:
     *
     * profundidade 1 -> Heading 2
     * profundidade 2 -> Heading 3
     * profundidade 3 -> Heading 4
     */
    const numeroDoHeading = Math.min(profundidade + 1, 6);
    const heading = headings[numeroDoHeading];

    if (!heading) {
      return;
    }

    paragrafo.setHeading(heading);
    quantidadeFormatada++;
  });

  DocumentApp.getUi().alert(
    'Estrutura aplicada',
    quantidadeFormatada +
      ' parágrafo(s) formatado(s).\n' +
      quantidadeIgnorada +
      ' item(ns) de lista ignorado(s).',
    DocumentApp.getUi().ButtonSet.OK
  );
}
