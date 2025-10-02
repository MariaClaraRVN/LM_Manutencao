import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency } from './formatters'
import type { Cliente, Item } from '../types'

/**
 * Gera e faz o download do PDF com as informações do orçamento
 * @param cliente - Informações do cliente
 * @param itens - Lista de itens do orçamento
 * @param total - Valor total do orçamento
 * @param observacoesPersonalizadas - Observações adicionais personalizadas (opcional)
 */
export const generatePDF = async (cliente: Cliente, itens: Item[], total: number, observacoesPersonalizadas?: string): Promise<void> => {
  // Cria um novo documento PDF
  const doc = new jsPDF()

  // --- Seção de Marcação da Empresa ---
  // Carrega e adiciona o logo da empresa
  const logoUrl = `${window.location.origin}/LM_Manutencao.png`
  const response = await fetch(logoUrl)
  const blob = await response.blob()
  const reader = new FileReader()
  await new Promise((resolve) => {
    reader.onload = resolve
    reader.readAsDataURL(blob)
  })
  const logoData = reader.result as string
  doc.addImage(logoData, 'PNG', 58, 0, 100, 35)

  // Nome da empresa e título
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('ORÇAMENTO COMERCIAL', 108, 40, { align: 'center' })

  doc.setFont('helvetica', 'normal') 
  // Data de criação
  const dataAtual = new Date().toLocaleDateString('pt-BR')
  doc.setFontSize(10)
  doc.text(`Data: ${dataAtual}`, 190, 47, { align: 'right' })

  // --- Seção de Informações do Cliente ---
  doc.setFontSize(12)
  doc.text('Dados do Cliente', 14, 55)

  doc.setFontSize(10)
  doc.text(`Empresa: ${cliente.nomeEmpresa}`, 14, 63)   // Começa à esquerda
  doc.text(`CNPJ: ${cliente.cnpj}`, 120, 63)            // Começa mais à direita, mesma linha (Y)

  if (cliente.nomeRepresentante || cliente.cpfRepresentante) {
    doc.text(
      `Representante: ${cliente.nomeRepresentante || ''}`,
      14,
      70
    )
    doc.text(
      `CPF do Representante: ${cliente.cpfRepresentante || ''}`,
      120,
      70
    )
  }
  
  if (cliente.marcaMaquina || cliente.modeloMaquina) {
    doc.text(
      `Marca da Máquina: ${cliente.marcaMaquina || ''}`,
      14,
      77
    )
    doc.text(
      `Modelo da Máquina: ${cliente.modeloMaquina || ''}`,
      120,
      77
    )
  }

  // --- Seção de Itens ---
  doc.setFontSize(12)
  doc.text('Itens do Orçamento', 14, 90)

  // Verifica se algum item tem valor preenchido
  const hasValues = itens.some(item => item.valorTotal && item.valorTotal > 0)
  
  // Dados da tabela - inclui coluna de valor apenas se algum item tiver valor
  const tableColumns = hasValues 
    ? [
        { header: 'Qtd', dataKey: 'quantidade' },
        { header: 'Descrição', dataKey: 'descricao' },
        { header: 'Valor Unit. (R$)', dataKey: 'valor' }
      ]
    : [
        { header: 'Qtd', dataKey: 'quantidade' },
        { header: 'Descrição', dataKey: 'descricao' }
      ]
      
  const tableRows = itens.map(item => {
    const row: any = {
      quantidade: item.quantidade.toString(),
      descricao: item.descricao
    }
    
    if (hasValues) {
      row.valor = item.valorTotal && item.valorTotal > 0 
        ? formatCurrency(item.valorTotal) 
        : '-'
    }
    
    return row
  })
  
    // Adiciona a tabela ao PDF
  autoTable(doc, {
    startY: 95, // valor menor para subir a tabela
    head: [tableColumns.map(col => col.header)],
    body: hasValues 
      ? tableRows.map(row => [row.quantidade, row.descricao, row.valor])
      : tableRows.map(row => [row.quantidade, row.descricao]),
    theme: 'striped',
    headStyles: { fillColor: [34, 109, 34], textColor: 255 },
    columnStyles: hasValues 
      ? {
          0: { halign: 'center', cellWidth: 20 },
          1: { halign: 'left' },
          2: { halign: 'right', cellWidth: 30 }
        }
      : {
          0: { halign: 'center', cellWidth: 20 },
          1: { halign: 'left' }
        }
  })
  
  // Adiciona o valor total
  const finalY = (doc as any).lastAutoTable.finalY + 12
  doc.setFontSize(12)
  doc.text(`Total: ${formatCurrency(total)}`, 180, finalY, { align: 'right' })
  
  // Observações
  const obsY = finalY + 10
  doc.setFontSize(12)
  doc.text('Observações:', 14, obsY)
  
  doc.setFontSize(10)
  doc.text('Garantia: 90 dias', 14, obsY + 7)
  doc.text('Execução: até 3 dias úteis após depósito inicial', 14, obsY + 15)
  doc.text('Necessário entrada de 50% e restante ao final do serviço', 14, obsY + 23)
  
  // Adiciona observações personalizadas se fornecidas
  let nextY = obsY + 33
  if (observacoesPersonalizadas && observacoesPersonalizadas.trim()) {
    // Título das observações adicionais
    doc.setFontSize(12)
    doc.text('Observações Adicionais:', 14, nextY)
    
    // Conteúdo das observações personalizadas
    doc.setFontSize(10)
    const linhas = doc.splitTextToSize(observacoesPersonalizadas, 180)
    doc.text(linhas, 14, nextY + 8)
    nextY += 8 + (linhas.length * 6) // Ajusta a posição Y baseado no número de linhas
  }
  
  // Pagamento 
  const pagamentoY = nextY + 5
  doc.setFontSize(12)
  doc.text('Pagamento:', 14, pagamentoY)
  
  doc.setFontSize(10)
  doc.text('Deposito banco Nubank: 260 - Agência: 0001 - Conta: 56310862-1', 14, pagamentoY + 7)
  doc.text('Pix CNPJ: 40080991000184', 14, pagamentoY + 15)
  doc.text('Este orçamento tem validade de 15 dias', 14, pagamentoY + 23)
  
  // Rodapé
/*   doc.setFontSize(8)
  doc.text('LM Manutenções - Orçamento Comercial', 105, 285, { align: 'center' }) */
  
  // Gera o nome do arquivo PDF baseado no nome do cliente
  const clientName = cliente.nomeEmpresa.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_').toLowerCase()
  const filename = `orcamento_${clientName}.pdf`
  
  // Salva o PDF
  doc.save(filename)
}