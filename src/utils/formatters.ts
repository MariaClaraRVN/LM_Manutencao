/**
 * Formata um número como moeda brasileira (R$)
 * @param value - O número a ser formatado
 * @returns String da moeda formatada
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Aplica máscara de CNPJ a um valor string
 * Formato: 00.000.000/0000-00
 * @param value - O valor do CNPJ a ser mascarado
 * @returns String do CNPJ mascarado
 */
export const maskCNPJ = (value: string): string => {
  // Remove todos os caracteres não-numéricos
  const digits = value.replace(/\D/g, '')
  
  if (digits.length <= 2) {
    return digits
  }
  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  }
  
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
}

/**
 * Aplica máscara de CPF a um valor string
 * Formato: 000.000.000-00
 * @param value - O valor do CPF a ser mascarado
 * @returns String do CPF mascarado
 */
export const maskCPF = (value: string): string => {
  // Remove todos os caracteres não-numéricos
  const digits = value.replace(/\D/g, '')
  
  if (digits.length <= 3) {
    return digits
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }
  
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}