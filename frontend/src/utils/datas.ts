export const NOMES_DOS_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const MESES_ABREVIADOS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function doisDigitos(numero: number): string {
  return numero < 10 ? '0' + numero : String(numero);
}

export function montarData(ano: number, mes: number, dia: number): string {
  return ano + '-' + doisDigitos(mes + 1) + '-' + doisDigitos(dia);
}

export function dataDeHoje(): string {
  const hoje = new Date();
  return montarData(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
}

export function formatarDiaMes(data: string): string {
  const partes = data.split('-');
  return partes[2] + '/' + partes[1];
}

export function formatarSelo(data: string): string {
  const partes = data.split('-');
  const mes = Number(partes[1]) - 1;
  return partes[2] + ' ' + MESES_ABREVIADOS[mes];
}

export function diasNoMes(ano: number, mes: number): number {
  return new Date(ano, mes + 1, 0).getDate();
}

export function primeiroDiaDaSemana(ano: number, mes: number): number {
  return new Date(ano, mes, 1).getDay();
}
