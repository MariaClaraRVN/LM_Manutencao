/**
 * Interface representing a client/customer
 */
export interface Cliente {
  nomeEmpresa: string;
  cnpj: string;
  nomeRepresentante: string;
  cpfRepresentante: string;
}

/**
 * Interface representing a budget item
 */
export interface Item {
  quantidade: number;
  descricao: string;
  valorUnitario: number;
}