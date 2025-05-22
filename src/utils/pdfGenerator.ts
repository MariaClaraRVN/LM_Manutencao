import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency } from './formatters'
import type { Cliente, Item } from '../types'

/**
 * Generate and download a PDF with the budget information
 * @param cliente - Client information
 * @param itens - List of budget items
 * @param total - Total budget value
 */
export const generatePDF = async (cliente: Cliente, itens: Item[], total: number): Promise<void> => {
  // Create a new PDF document
  const doc = new jsPDF()
  
  /**
   * Company Branding Section
   * 
   * This section handles the company's visual identity in the PDF:
   * 1. Logo Image:
   *    - Dimensions: 80x60 pixels
   *    - Position: Centered at the top of the page
   *    - Format: JPEG loaded from external URL
   * 
   * 2. Company Name:
   *    - Font Size: 20pt
   *    - Position: Centered below the logo
   *    - Text: "L⚡M Manutenções"
   * 
   * 3. Contact Information:
   *    - Font Size: 10pt
   *    - Details: Email and phone number
   *    - Layout: Centered, with consistent spacing
   */
  
  // Load and add the company logo
  const logoUrl = `${window.location.origin}/LM_Manutencoes.png`
  const response = await fetch(logoUrl)
  const blob = await response.blob()
  
  // Convert blob to base64
  const reader = new FileReader()
  await new Promise((resolve) => {
    reader.onload = resolve
    reader.readAsDataURL(blob)
  })
  const logoData = reader.result as string
  
  // Add the logo to the PDF
  doc.addImage(logoData, 'PNG', 70, 0, 80, 60)
  
  // Set font size and add company header
  //doc.setFontSize(20)
  //doc.text('L⚡M Manutenções', 105, 80, { align: 'center' })
  
  // Add company contact information
  /* doc.setFontSize(10)
  doc.text('Email: lincoln.manutencoes@gmail.com', 105, 88, { align: 'center' })
  doc.text('Telefone: (11) 4002-8922', 105, 94, { align: 'center' }) */
  
  // Add document title
  doc.setFontSize(16)
  doc.text('Orçamento Comercial', 105, 70, { align: 'center' }) // era 105
  
  // Add creation date
  const dataAtual = new Date().toLocaleDateString('pt-BR')
  doc.setFontSize(10)
  doc.text(`Data: ${dataAtual}`, 190, 77, { align: 'right' }) // era 112
  
  // Add client information section
  doc.setFontSize(12)
  doc.text('Dados do Cliente', 14, 85) // era 120
  
  doc.setFontSize(10)
  doc.text(`Empresa: ${cliente.nomeEmpresa}`, 14, 93) // era 128
  doc.text(`CNPJ: ${cliente.cnpj}`, 14, 99) // era 134
  
  if (cliente.nomeRepresentante) {
    doc.text(`Representante: ${cliente.nomeRepresentante}`, 14, 105) // era 140
  }
  
  if (cliente.cpfRepresentante) {
    doc.text(`CPF do Representante: ${cliente.cpfRepresentante}`, 14, 111) // era 146
  }
  
  // Add items table
  doc.setFontSize(12)
  doc.text('Itens do Orçamento', 14, 123) // era 158
  
  // Prepare table data
  const tableColumns = [
    { header: 'Qtd', dataKey: 'quantidade' },
    { header: 'Descrição', dataKey: 'descricao' },
    { header: 'Valor Unit.', dataKey: 'valorUnitario' },
    { header: 'Valor Total', dataKey: 'valorTotal' }
  ]
  
  const tableRows = itens.map(item => ({
    quantidade: item.quantidade.toString(),
    descricao: item.descricao,
    valorUnitario: formatCurrency(item.valorUnitario),
    valorTotal: formatCurrency(item.quantidade * item.valorUnitario)
  }))
  
  // Add the table to the PDF
  autoTable(doc, {
    startY: 127, // era 162
    head: [tableColumns.map(col => col.header)],
    body: tableRows.map(row => [
      row.quantidade,
      row.descricao,
      row.valorUnitario,
      row.valorTotal
    ]),
    theme: 'striped',
    headStyles: { fillColor: [8, 83, 13], textColor: 255 },
    columnStyles: {
      0: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  })
  
  // Add total value
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(12)
  doc.text(`Total: ${formatCurrency(total)}`, 190, finalY, { align: 'right' })


  // Add observations
  doc.setFontSize(12)
  doc.text('Pagamento:', 14, finalY + 15)
  
  doc.setFontSize(10)
  doc.text('Deposito banco Nubank: 260 - Agência: 0001 - Conta: 56310862-1', 14, finalY + 23)
  doc.text('Pix CNPJ: 40080991000184', 14, finalY + 30)

  // Add observations
  doc.setFontSize(12)
  doc.text('Observações:', 14, finalY + 45)
  
  doc.setFontSize(10)
  doc.text('Garantia: 90 dias', 14, finalY + 53)
  doc.text('Execução: até 3 dias úteis após depósito inicial', 14, finalY + 60)
  doc.text('Este orçamento tem validade de 15 dias', 14, finalY + 67)
  
  // Add footer with page number
  doc.setFontSize(8)
  doc.text('LM Manutenções - Orçamento Comercial', 105, 285, { align: 'center' })
  
  // Generate the PDF filename based on client name
  const clientName = cliente.nomeEmpresa.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_').toLowerCase()
  const filename = `orcamento_${clientName}.pdf`
  
  // Save the PDF
  doc.save(filename)
}