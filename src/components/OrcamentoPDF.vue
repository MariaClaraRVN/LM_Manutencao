<script setup lang="ts">
import { ref } from 'vue'
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
  cpfRepresentante: '',
  modeloMaquina: '', // novo campo
  marcaMaquina: ''   // novo campo
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
  <v-container class="pa-0 pa-sm-3" fluid>
    <v-card class="mb-2 mb-sm-6" :flat="$vuetify.display.xs">
      <!-- Cabeçalho otimizado para mobile -->
      <v-card-title class="text-h5 text-sm-h4 d-flex flex-column align-center pa-3 pa-sm-4 primary white--text">
        <v-img
          src="/LM_Manutencoes.png"
          alt="L&M Manutenções"
          class="mb-1 mb-sm-2"
          :width="$vuetify.display.xs ? 150 : ($vuetify.display.sm ? 220 : 300)"
          :height="$vuetify.display.xs ? 80 : ($vuetify.display.sm ? 120 : 200)"
          contain
        ></v-img>
        <span class="text-subtitle-2 text-sm-subtitle-1 mt-1"> 
          <b> ORÇAMENTO COMERCIAL </b> 
        </span>
      </v-card-title>
      
      <v-card-text class="pa-2 pa-sm-4">
        <!-- Formulário do cliente -->
        <ClientInfoForm v-model:cliente="cliente" />
        
        <!-- Tabela de itens com scroll horizontal em mobile -->
        <div class="mobile-scroll-wrapper">
          <ItemsTable 
            :itens="itens" 
            @add-item="handleAddItem" 
            @remove-item="handleRemoveItem"
            @update-item="handleUpdateItem"
          />
        </div>
        
        <!-- Valor total - ajuste fino para dispositivos Apple -->
        <v-row class="mt-2 mt-sm-3">
          <v-col cols="12" :class="{'px-0': $vuetify.display.xs}">
            <v-card outlined class="pa-2 pa-sm-3">
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-1 text-sm-h6">Total:</span>
                <span class="text-subtitle-1 text-sm-h6 font-weight-bold">
                  {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularTotal()) }}
                </span>
              </div>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Observações com fonte ligeiramente menor em mobile -->
        <ObservationsSection class="mt-2 mt-sm-3" />
        
        <!-- Botão flutuante para mobile -->
        <v-row class="mt-3 mt-sm-4 mb-2">
          <v-col cols="12" class="d-flex justify-center pa-0 pa-sm-2">
            <v-btn 
              color="primary" 
              :size="$vuetify.display.smAndUp ? 'large' : 'default'"
              :class="{
                'fixed-bottom': $vuetify.display.xs,
                'mx-2': $vuetify.display.xs,
                'mb-3': $vuetify.display.xs,
                'elevation-6': $vuetify.display.xs
              }"
              prepend-icon="mdi-file-pdf-box"
              @click="gerarPDF"
              :disabled="itens.length === 0 || !cliente.nomeEmpresa"
              :block="$vuetify.display.xs"
            >
              <span :class="{'d-none': $vuetify.display.xs}">Gerar PDF</span>
              <span class="d-inline d-sm-none">PDF</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
/* Ajustes específicos para iPhones */
@media (max-width: 428px) { /* iPhone 14 Pro Max, 12/13 Pro Max */
  .v-card-title {
    padding: 8px 4px !important;
  }
  
  .v-img {
    width: 140px !important;
    height: 70px !important;
  }
}

@media (max-width: 390px) { /* iPhone 12, 13, 14, XR */
  .v-card-text {
    padding: 8px !important;
  }
  
  .text-h5 {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 375px) { /* iPhone SE, 6/7/8 */
  .v-img {
    width: 120px !important;
    height: 60px !important;
  }
  
  .text-subtitle-2 {
    font-size: 0.75rem !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1024px) {
  .v-container {
    max-width: 90% !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  
  .v-card {
    border-radius: 12px !important;
  }
}

/* Scroll horizontal para a tabela em mobile */
.mobile-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* Suave no iOS */
  margin-left: -8px;
  margin-right: -8px;
  padding-left: 8px;
  padding-right: 8px;
}

/* Melhorias específicas para Safari iOS */
@supports (-webkit-touch-callout: none) {
  .v-btn {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }
}

/* Botão fixo no mobile */
.fixed-bottom {
  position: fixed !important;
  bottom: 12px;
  left: 16px;
  right: 16px;
  z-index: 100;
  width: calc(100% - 32px);
}
</style>