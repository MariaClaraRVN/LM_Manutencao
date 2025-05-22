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

// Atualiza as informações do cliente e emite o evento de atualização
const updateCliente = (field: keyof Cliente, value: string) => {
  const updatedCliente = { ...props.cliente, [field]: value }
  emit('update:cliente', updatedCliente)
}

// Aplica a máscara de CNPJ e atualiza
const handleCNPJInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const maskedValue = maskCNPJ(input.value)
  updateCliente('cnpj', maskedValue)
}

// Aplica a máscara de CPF e atualiza
const handleCPFInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const maskedValue = maskCPF(input.value)
  updateCliente('cpfRepresentante', maskedValue)
}
</script>

<template>
  <v-card outlined class="mb-6">
    <v-card-title class="text-h6 primary lighten-1 white--text">
      Dados do Cliente
    </v-card-title>
    
    <v-card-text class="pa-4">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="cliente.nomeEmpresa"
            label="Nome da Empresa"
            variant="outlined"
            density="comfortable"
            @input="updateCliente('nomeEmpresa', cliente.nomeEmpresa)"
            :rules="[v => !!v || 'Nome da empresa é obrigatório']"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field
            :value="cliente.cnpj"
            label="CNPJ"
            variant="outlined"
            density="comfortable"
            @input="handleCNPJInput"
            placeholder="00.000.000/0000-00"
            :rules="[v => !!v || 'CNPJ é obrigatório']"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field
            v-model="cliente.nomeRepresentante"
            label="Nome do Representante"
            variant="outlined"
            density="comfortable"
            @input="updateCliente('nomeRepresentante', cliente.nomeRepresentante)"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field
            :value="cliente.cpfRepresentante"
            label="CPF do Representante"
            variant="outlined"
            density="comfortable"
            @input="handleCPFInput"
            placeholder="000.000.000-00"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>