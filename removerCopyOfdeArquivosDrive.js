function renomearArquivosRemoverCopia() {
  // 1. Substitua pelo ID da sua pasta
  // O ID é a parte final da URL da pasta no navegador
  var folderId = 'SEU_ID_DA_PASTA_AQUI'; 
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  
  // 2. Defina o texto que deseja remover
  var textoParaRemover = "Copy of "; 
  // Caso seu Drive esteja em português, talvez precise mudar para "Cópia de "
  
  var contador = 0;

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    
    // Verifica se o nome do arquivo começa com o texto indesejado
    if (fileName.indexOf(textoParaRemover) === 0) {
      var newName = fileName.replace(textoParaRemover, "");
      file.setName(newName);
      contador++;
      Logger.log("Renomeado: " + fileName + " -> " + newName);
    }
  }
  
  Logger.log("Processo concluído. Arquivos renomeados: " + contador);
}
