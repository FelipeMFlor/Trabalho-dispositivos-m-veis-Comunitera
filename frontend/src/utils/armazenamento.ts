// =============================================================
// armazenamento.ts
// Funções para guardar e ler dados no navegador (localStorage).
// Assim, quando o aluno fecha e abre o app, as inscrições,
// compromissos e o login continuam salvos.
//
// O localStorage só guarda TEXTO. Por isso usamos:
//  - JSON.stringify  -> transforma objeto/lista em texto
//  - JSON.parse      -> transforma o texto de volta em objeto/lista
// =============================================================

// Salva um valor qualquer com um nome (chave).
// O <T> quer dizer "qualquer tipo": serve para lista, objeto, número...
export function salvar<T>(chave: string, valor: T): void {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Se o navegador bloquear o armazenamento, o app continua
    // funcionando, só não guarda os dados.
  }
}

// Lê um valor salvo. Se não existir nada, devolve o valor padrão.
export function carregar<T>(chave: string, valorPadrao: T): T {
  try {
    const texto = localStorage.getItem(chave);
    if (texto === null) {
      return valorPadrao;
    }
    return JSON.parse(texto) as T;
  } catch {
    return valorPadrao;
  }
}

// Apaga um valor salvo (usado no "Sair").
export function remover(chave: string): void {
  try {
    localStorage.removeItem(chave);
  } catch {
    // nada a fazer
  }
}
