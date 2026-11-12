// =============================================================
// datas.ts
// Funções pequenas para trabalhar com datas.
// Guardamos as datas como texto no formato "AAAA-MM-DD"
// (ex: "2026-11-09") porque é fácil de comparar e salvar.
// =============================================================

export const NOMES_DOS_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const MESES_ABREVIADOS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

// Coloca um zero na frente quando o número tem 1 dígito: 6 -> "06"
export function doisDigitos(numero: number): string {
  return numero < 10 ? '0' + numero : String(numero);
}

// Monta o texto "AAAA-MM-DD". Atenção: no JavaScript o mês começa em 0
// (janeiro = 0), por isso somamos 1.
export function montarData(ano: number, mes: number, dia: number): string {
  return ano + '-' + doisDigitos(mes + 1) + '-' + doisDigitos(dia);
}

// Data de hoje no formato "AAAA-MM-DD"
export function dataDeHoje(): string {
  const hoje = new Date();
  return montarData(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
}

// "2026-11-09" -> "09/11"
export function formatarDiaMes(data: string): string {
  const partes = data.split('-'); // ["2026", "11", "09"]
  return partes[2] + '/' + partes[1];
}

// "2026-11-20" -> "20 NOV" (usado no selo dos cards de evento)
export function formatarSelo(data: string): string {
  const partes = data.split('-');
  const mes = Number(partes[1]) - 1;
  return partes[2] + ' ' + MESES_ABREVIADOS[mes];
}

// Quantos dias tem um mês. Truque: o dia 0 do mês seguinte
// é o último dia do mês atual.
export function diasNoMes(ano: number, mes: number): number {
  return new Date(ano, mes + 1, 0).getDate();
}

// Em que dia da semana o mês começa (0 = domingo ... 6 = sábado)
export function primeiroDiaDaSemana(ano: number, mes: number): number {
  return new Date(ano, mes, 1).getDay();
}
