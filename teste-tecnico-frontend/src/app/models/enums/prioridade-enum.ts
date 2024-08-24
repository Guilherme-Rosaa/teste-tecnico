export enum EnumPrioridadeTarefa{
  Baixa = 1,
  Media = 2,
  Alta = 3
}

export function getPrioridadeOptions(): { chave: string, valor: EnumPrioridadeTarefa }[] {
  return Object.keys(EnumPrioridadeTarefa)
    .filter(key => isNaN(Number(key))) // Filtra apenas as chaves, não os valores numéricos
    .map(key => ({ chave: key, valor: EnumPrioridadeTarefa[key as keyof typeof EnumPrioridadeTarefa] }));
}
