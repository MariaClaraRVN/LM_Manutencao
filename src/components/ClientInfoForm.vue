<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Cliente } from '../types'
import { maskCNPJ, maskCPF } from '../utils/formatters'

const props = defineProps<{
  cliente: Cliente
}>()

const emit = defineEmits<{
  'update:cliente': [cliente: Cliente]
}>()

// Atualiza informações do cliente e emite a atualização
const updateCliente = (field: keyof Cliente, value: string) => {
  const updatedCliente = { ...props.cliente, [field]: value }
  emit('update:cliente', updatedCliente)
}

// Aplica a máscara de CNPJ e atualiza
/* const handleCNPJInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const maskedValue = maskCNPJ(input.value)
  updateCliente('cnpj', maskedValue)
} */

// Aplica a máscara de CPF e atualiza
/* const handleCPFInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const maskedValue = maskCPF(input.value)
  updateCliente('cpfRepresentante', maskedValue)
} */
</script>

<template>
  <v-card outlined class="mb-6">
    <v-card-title class="text-h6 primary lighten-1 white--text">
      Dados do Cliente
    </v-card-title>
    
    <v-card-text class="pa-4">
      <v-row>
        <!-- Campos existentes -->
        <v-col cols="12" md="6">
          <v-text-field v-model="cliente.nomeEmpresa" label="Nome da Empresa" variant="outlined" density="comfortable"
            @input="updateCliente('nomeEmpresa', cliente.nomeEmpresa)"
            :rules="[v => !!v || 'Nome da empresa é obrigatório']"></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field :value="cliente.cnpj" label="CNPJ" variant="outlined" density="comfortable"
            @update:model-value="(value) => updateCliente('cnpj', maskCNPJ(value))" placeholder="00.000.000/0000-00"
            :rules="[v => !!v || 'CNPJ é obrigatório']"></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field v-model="cliente.nomeRepresentante" label="Nome do Representante" variant="outlined"
            density="comfortable" @input="updateCliente('nomeRepresentante', cliente.nomeRepresentante)"></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field :value="cliente.cpfRepresentante" label="CPF do Representante" variant="outlined"
            density="comfortable" @update:model-value="(value) => updateCliente('cpfRepresentante', maskCPF(value))"
            placeholder="000.000.000-00"></v-text-field>
        </v-col>

        <!-- Novos campos de Máquina -->
        <v-col cols="12" md="6">
          <v-text-field v-model="cliente.marcaMaquina" label="Marca da Máquina" variant="outlined" density="comfortable"
            @input="updateCliente('marcaMaquina', cliente.marcaMaquina)"
            :rules="[v => !!v || 'Marca da máquina é obrigatória']"></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="cliente.modeloMaquina" label="Modelo da Máquina" variant="outlined"
            density="comfortable" @input="updateCliente('modeloMaquina', cliente.modeloMaquina)"
            :rules="[v => !!v || 'Modelo da máquina é obrigatório']"></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Garante que o card e seus filhos nunca ultrapassem a largura da tela */
.v-card,
.v-card-text,
.v-card-title,
.v-row,
.v-col,
.v-text-field {
  box-sizing: border-box !important;
  max-width: 100vw !important;
  width: 100% !important;
  
}

/* Remove padding lateral em telas pequenas */
@media (max-width: 600px) {
  .v-card-text, .v-card-title {
    padding-left: 4px !important;
    padding-right: 4px !important;
  }
  .v-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>