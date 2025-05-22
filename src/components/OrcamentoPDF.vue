<script setup lang="ts">
import { ref } from 'vue'
import LMLogo from '../assets/LM_Manutencoes.png'
import ClientInfoForm from './ClientInfoForm.vue'
import ItemsTable from './ItemsTable.vue'
import ObservationsSection from './ObservationsSection.vue'
import { generatePDF } from '../utils/pdfGenerator'
import type { Cliente, Item } from '../types'

// Dados do cliente
const cliente = ref<Cliente>({
  nomeEmpresa: '',
  cnpj: '',
  nomeRepresentante: '',
  cpfRepresentante: ''
})

// Dados da lista de itens
const itens = ref<Item[]>([])

// Adiciona um novo item à lista
const handleAddItem = (item: Item) => {
  itens.value.push(item)
}

// Remove um item da lista
const handleRemoveItem = (index: number) => {
  itens.value.splice(index, 1)
}

// Atualiza um item da lista
const handleUpdateItem = (index: number, updatedItem: Item) => {
  itens.value[index] = updatedItem
}

// Calcula o valor total de todos os itens
const calcularTotal = () => {
  return itens.value.reduce((total, item) => total + (item.quantidade * item.valorUnitario), 0)
}

// Gera e faz o download do PDF
const gerarPDF = async () => {
  if (!cliente.value.nomeEmpresa) {
    alert('Por favor, preencha o nome da empresa!')
    return
  }
  
  if (itens.value.length === 0) {
    alert('Por favor, adicione pelo menos um item ao orçamento!')
    return
  }
  
  await generatePDF(cliente.value, itens.value, calcularTotal())
}
</script>

<template>
  <v-container>
    <v-card class="mb-6">
      <!-- Cabeçalho da Empresa
           Esta seção exibe a identidade visual da empresa:
           - Logo: Imagem profissional representando a empresa (200x150px)
           - Nome da Empresa: "L⚡M Manutenções" com ícone de raio
           - Tipo de Documento: "Orçamento Comercial"
           
           O layout é centralizado e utiliza o tema de cor primária
           com texto branco para contraste
      -->
      <v-card-title class="text-h4 d-flex flex-column align-center pa-4 primary white--text">
        <v-img
          src="/LM_Manutencoes.png"
          alt="L&M Manutenções"
          class="mb-4"
          width="300"
          height="200"
          cover
        ></v-img>
        <!-- <div class="d-flex align-center">
          <v-icon size="large" color="white" class="mr-2">mdi-flash</v-icon>
          L⚡M Manutenções
        </div> -->
        <span class="text-subtitle-1 mt-2"> <b> ORÇAMENTO COMERCIAL </b> </span>
      </v-card-title>
      
      <v-card-text>
        <!-- Informações de Contato da Empresa
             Exibe os dados de contato essenciais:
             - Email: Para contatos comerciais
             - Telefone: Para contato direto
             
             Layout centralizado com espaçamento consistente
        -->
        <!-- <div class="text-subtitle-1 text-center mb-4">
          <div>Email: lincoln.manutencoes@gmail.com</div>
          <div>Telefone: (11) 4002-8922</div>
        </div> -->
        
        <!-- Formulário de informações do cliente -->
        <ClientInfoForm v-model:cliente="cliente" />
        
        <!-- Tabela de itens -->
        <ItemsTable 
          :itens="itens" 
          @add-item="handleAddItem" 
          @remove-item="handleRemoveItem"
          @update-item="handleUpdateItem"
        />
        
        <!-- Valor total -->
        <v-row class="mt-4">
          <v-col cols="12" sm="6" offset-sm="6">
            <v-card outlined class="pa-4">
              <div class="d-flex justify-space-between">
                <span class="text-h6">Total:</span>
                <span class="text-h6">{{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularTotal()) }}</span>
              </div>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Seção de observações -->
        <ObservationsSection />
        
        <!-- Botão para gerar PDF -->
        <v-row class="mt-6">
          <v-col cols="12" class="d-flex justify-center">
            <v-btn 
              color="primary" 
              size="large" 
              prepend-icon="mdi-file-pdf-box"
              @click="gerarPDF"
              :disabled="itens.length === 0 || !cliente.nomeEmpresa"
              class="elevation-2"
            >
              Gerar PDF
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>