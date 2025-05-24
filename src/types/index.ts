/**
 * Interface representing a client/customer
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
 * Interface representing a budget item
 */
export interface Item {
  quantidade: number;
  descricao: string;
  valorTotal: number;
}