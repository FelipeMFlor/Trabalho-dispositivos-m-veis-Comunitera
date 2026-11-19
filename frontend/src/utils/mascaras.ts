function soNumeros(texto: string): string {
  return texto.replace(/\D/g, '');
}

export function mascaraHora(texto: string): string {
  const numeros = soNumeros(texto).slice(0, 4);
  if (numeros.length <= 2) {
    return numeros;
  }
  return numeros.slice(0, 2) + ':' + numeros.slice(2);
}

export function mascaraData(texto: string): string {
  const numeros = soNumeros(texto).slice(0, 8);
  if (numeros.length <= 2) {
    return numeros;
  }
  if (numeros.length <= 4) {
    return numeros.slice(0, 2) + '/' + numeros.slice(2);
  }
  return numeros.slice(0, 2) + '/' + numeros.slice(2, 4) + '/' + numeros.slice(4);
}

export function horaValida(hora: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(hora)) {
    return false;
  }
  const [h, m] = hora.split(':').map(Number);
  return h <= 23 && m <= 59;
}

export function dataParaServidor(dataDigitada: string): string {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataDigitada)) {
    return '';
  }
  const [dia, mes, ano] = dataDigitada.split('/').map(Number);
  const teste = new Date(ano, mes - 1, dia);
  if (teste.getDate() !== dia || teste.getMonth() !== mes - 1) {
    return '';
  }
  return dataDigitada.split('/').reverse().join('-');
}
