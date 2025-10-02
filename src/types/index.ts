/**
 * Interface representando um cliente
 */
export interface Cliente {
  nomeEmpresa: string
  cnpj: string
  nomeRepresentante: string
  cpfRepresentante: string
  modeloMaquina: string // novo campo
  marcaMaquina: string  // novo campo
}

/**
 * Interface representando um item do orçamento
 */
export interface Item {
  quantidade: number;
  descricao: string;
  valorTotal: number;
}