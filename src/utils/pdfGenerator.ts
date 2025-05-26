import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency } from './formatters'
import type { Cliente, Item } from '../types'

/**
 * Gera e faz o download do PDF com as informações do orçamento
 * @param cliente - Informações do cliente
 * @param itens - Lista de itens do orçamento
 * @param total - Valor total do orçamento
 */
export const generatePDF = async (cliente: Cliente, itens: Item[], total: number): Promise<void> => {
  // Cria um novo documento PDF
  const doc = new jsPDF()

  // --- Seção de Branding da Empresa ---
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

  // Dados da tabela
  const tableColumns = [
    { header: 'Qtd', dataKey: 'quantidade' },
    { header: 'Descrição', dataKey: 'descricao' }
  ]
  const tableRows = itens.map(item => ({
    quantidade: item.quantidade.toString(),
    descricao: item.descricao
  }))
  
    // Add the table to the PDF
  autoTable(doc, {
    startY: 95, // valor menor para subir a tabela
    head: [tableColumns.map(col => col.header)],
    body: tableRows.map(row => [
      row.quantidade,
      row.descricao
    ]),
    theme: 'striped',
    headStyles: { fillColor: [34, 109, 34], textColor: 255 },
    columnStyles: {
      0: { halign: 'left' }
    }
  })
  
  // Add total value
  const finalY = (doc as any).lastAutoTable.finalY + 12
  doc.setFontSize(12)
  doc.text(`Total: ${formatCurrency(total)}`, 180, finalY, { align: 'right' })
  
  // Pagamento
  const pagamentoY = finalY + 5 // subiu a seção de pagamento
  doc.setFontSize(12)
  doc.text('Pagamento:', 14, pagamentoY)
  
  doc.setFontSize(10)
  doc.text('Deposito banco Nubank: 260 - Agência: 0001 - Conta: 56310862-1', 14, pagamentoY + 7)
  doc.text('Pix CNPJ: 40080991000184', 14, pagamentoY + 15)
  doc.text('Este orçamento tem validade de 15 dias', 14, pagamentoY + 23)
  
  // Observações
  const obsY = pagamentoY + 35
  doc.setFontSize(12)
  doc.text('Observações:', 14, obsY)
  
  doc.setFontSize(10)
  doc.text('Garantia: 90 dias', 14, obsY + 7)
  doc.text('Execução: até 3 dias úteis após depósito inicial', 14, obsY + 15)
  doc.text('Necessário entrada de 50% e restante ao final do serviço', 14, obsY + 23)
  
  // Footer
/*   doc.setFontSize(8)
  doc.text('LM Manutenções - Orçamento Comercial', 105, 285, { align: 'center' }) */
  
  // Generate the PDF filename based on client name
  const clientName = cliente.nomeEmpresa.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_').toLowerCase()
  const filename = `orcamento_${clientName}.pdf`
  
  // Save the PDF
  doc.save(filename)
}