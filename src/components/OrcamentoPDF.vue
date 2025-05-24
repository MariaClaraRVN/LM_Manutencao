<script setup lang="ts">
import { ref } from 'vue'
import ClientInfoForm from './ClientInfoForm.vue'
import ItemsTable from './ItemsTable.vue'
import ObservationsSection from './ObservationsSection.vue'
import { generatePDF } from '../utils/pdfGenerator'
import type { Cliente, Item } from '../types'

// Client information data
const cliente = ref<Cliente>({
  nomeEmpresa: '',
  cnpj: '',
  nomeRepresentante: '',
  cpfRepresentante: '',
  marcaMaquina: '',
  modeloMaquina: ''
})

// Items list data
const itens = ref<Item[]>([])

// Total budget value
const valorTotal = ref<number>(0)

// Handle adding a new item to the list
const handleAddItem = (item: Item) => {
  itens.value.push(item)
}

// Handle removing an item from the list
const handleRemoveItem = (index: number) => {
  itens.value.splice(index, 1)
}

// Handle updating an item in the list
const handleUpdateItem = (index: number, updatedItem: Item) => {
  itens.value[index] = updatedItem
}

// Generate and download the PDF
const gerarPDF = async () => {
  if (!cliente.value.nomeEmpresa) {
    alert('Por favor, preencha o nome da empresa!')
    return
  }
  
  if (itens.value.length === 0) {
    alert('Por favor, adicione pelo menos um item ao orçamento!')
    return
  }
  
  await generatePDF(cliente.value, itens.value, valorTotal.value)
}
</script>

<template>
  <v-container class="pa-2 pa-sm-4">
    <v-card class="mb-6">
      <!-- Company Header Section
           This section displays the company's branding and identity:
           - Logo: A professional image representing the company (200x150px)
           - Company Name: "L⚡M Manutenções" with lightning bolt icon
           - Document Type: "Orçamento Comercial" (Commercial Budget)
           
           The layout is centered and uses the primary color theme
           with white text for contrast
      -->
      <v-card-title class="text-h5 text-sm-h4 d-flex flex-column align-center pa-4 primary white--text">
        <v-img
          src="/public/LM_Manutencao.png"
          alt="L&M Manutenções"
          class="mb-4"
          :width="$vuetify.display.smAndDown ? 150 : 200"
          :height="$vuetify.display.smAndDown ? 112 : 150"
          cover
        ></v-img>
<!--         <div class="d-flex align-center text-center">
          <v-icon size="large" color="white" class="mr-2">mdi-flash</v-icon>
          L⚡M Manutenções
        </div> -->
        <span class="text-subtitle-1 mt-2">Orçamento Comercial</span>
      </v-card-title>
      
      <v-card-text>
        <!-- Company Contact Information
             Displays essential contact details:
             - Email: For business inquiries
             - Phone: For direct contact
             
             Centered layout with consistent spacing
        -->
<!--         <div class="text-subtitle-1 text-center mb-4">
          <div class="text-body-1 text-sm-subtitle-1">Email: lincoln.manutencoes@gmail.com</div>
          <div class="text-body-1 text-sm-subtitle-1">Telefone: (11) 4002-8922</div>
        </div> -->
        
        <!-- Client information form -->
        <ClientInfoForm v-model:cliente="cliente" />
        
        <!-- Items table -->
        <ItemsTable 
          :itens="itens" 
          @add-item="handleAddItem" 
          @remove-item="handleRemoveItem"
          @update-item="handleUpdateItem"
        />
        
          <!-- Total value input -->
        <v-row class="mt-4">
          <v-col cols="12" sm="8" md="6" :offset-sm="0" :offset-md="3">
            <v-card outlined class="pa-4">
              <v-text-field
                v-model.number="valorTotal"
                type="number"
                label="Valor Total do Orçamento (R$)"
                variant="outlined"
                density="comfortable"
                min="0"
                step="0.01"
                :rules="[v => v > 0 || 'Valor total deve ser maior que zero']"
              ></v-text-field>
              <div v-if="valorTotal > 0" class="mt-2 text-right font-weight-bold">
        Valor Total: R$ {{ valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
      </div>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Observations section -->
        <ObservationsSection />
        
        <!-- Generate PDF button -->
        <v-row class="mt-6">
          <v-col cols="12" class="d-flex justify-center">
            <v-btn 
              color="primary" 
              size="large" 
              prepend-icon="mdi-file-pdf-box"
              @click="gerarPDF"
              :disabled="itens.length === 0 || !cliente.nomeEmpresa || valorTotal <= 0"
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

// ...existing code...
<style scoped>
/* Impede scroll horizontal em qualquer resolução */
html, body, #app, .v-application, .v-container {
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

/* Garante que todos os elementos internos respeitem a largura da tela */
.v-card,
.v-card-text,
.v-card-title,
.v-row,
.v-col,
.v-img,
.v-btn,
.v-text-field {
  box-sizing: border-box !important;
  max-width: 100% !important;
}

/* Ajuste para tabelas ou grids que possam causar overflow */
table, .v-table, .items-table-responsive {
  width: 100% !important;
  min-width: 0 !important;
  overflow-x: auto !important;
}

.v-responsive, .v-img{
    height: 150px;
    width: 445px !important;
}
</style>