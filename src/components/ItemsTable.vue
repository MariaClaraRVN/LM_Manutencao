<script setup lang="ts">
import { ref } from 'vue'
import { formatCurrency } from '../utils/formatters'
import type { Item } from '../types'

defineProps<{
  itens: Item[]
}>()

const emit = defineEmits<{
  'add-item': [item: Item]
  'remove-item': [index: number]
  'update-item': [index: number, item: Item]
}>()

// Dados do novo item
const novoItem = ref<Item>({
  quantidade: 1,
  descricao: '',
  valorUnitario: 0,
})

// Calcula o valor total baseado na quantidade e valor unitário
const calcularValorTotal = (quantidade: number, valorUnitario: number): number => {
  return quantidade * valorUnitario
}

// Adiciona um novo item à lista
const adicionarItem = () => {
  if (!novoItem.value.descricao || novoItem.value.valorUnitario <= 0) {
    alert('Por favor, preencha a descrição e o valor unitário!')
    return
  }
  
  emit('add-item', { ...novoItem.value })
  
  // Reseta o formulário para um novo item
  novoItem.value = {
    quantidade: 1,
    descricao: '',
    valorUnitario: 0,
  }
}

// Atualiza um item na lista
const atualizarItem = (index: number, field: keyof Item, value: string | number) => {
  const item = { ...props.itens[index] }
  
  if (field === 'quantidade' || field === 'valorUnitario') {
    item[field] = typeof value === 'string' ? parseFloat(value) || 0 : value
  } else {
    item[field] = value as string
  }
  
  emit('update-item', index, item)
}

// Remove um item da lista
const removerItem = (index: number) => {
  emit('remove-item', index)
}
</script>

<template>
  <v-card outlined class="mb-6">
    <v-card-title class="text-h6 primary lighten-1 white--text">
      Itens do Orçamento
    </v-card-title>
    
    <v-card-text class="pa-4">
      <!-- Adiciona um novo item -->
      <v-row align="center">
        <v-col cols="12" sm="2">
          <v-text-field
            v-model.number="novoItem.quantidade"
            type="number"
            label="Quantidade"
            variant="outlined"
            density="comfortable"
            min="1"
            :rules="[v => v > 0 || 'Quantidade deve ser maior que zero']"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="5">
          <v-text-field
            v-model="novoItem.descricao"
            label="Descrição"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Descrição é obrigatória']"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="3">
          <v-text-field
            v-model.number="novoItem.valorUnitario"
            type="number"
            label="Valor Unitário (R$)"
            variant="outlined"
            density="comfortable"
            min="0"
            step="0.01"
            :rules="[v => v > 0 || 'Valor deve ser maior que zero']"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="2" class="d-flex align-center">
          <v-btn 
            color="primary" 
            @click="adicionarItem"
            prepend-icon="mdi-plus"
            class="ml-2"
            :disabled="!novoItem.descricao || novoItem.valorUnitario <= 0"
          >
            Adicionar
          </v-btn>
        </v-col>
      </v-row>
      
      <!-- Tabela de itens -->
      <v-table v-if="itens.length > 0" class="mt-4">
        <thead>
          <tr>
            <th class="text-left">Qtd</th>
            <th class="text-left">Descrição</th>
            <th class="text-right">Valor Unit.</th>
            <th class="text-right">Valor Total</th>
            <th class="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in itens" :key="index">
            <td>
              <v-text-field
                :value="item.quantidade"
                type="number"
                variant="plain"
                density="compact"
                hide-details
                min="1"
                @input="e => atualizarItem(index, 'quantidade', e.target.value)"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                :value="item.descricao"
                variant="plain"
                density="compact"
                hide-details
                @input="e => atualizarItem(index, 'descricao', e.target.value)"
              ></v-text-field>
            </td>
            <td class="text-right">
              <v-text-field
                :value="item.valorUnitario"
                type="number"
                variant="plain"
                density="compact"
                hide-details
                min="0"
                step="0.01"
                class="text-right"
                @input="e => atualizarItem(index, 'valorUnitario', e.target.value)"
              ></v-text-field>
            </td>
            <td class="text-right">{{ formatCurrency(calcularValorTotal(item.quantidade, item.valorUnitario)) }}</td>
            <td class="text-center">
              <v-btn
                density="compact"
                icon="mdi-delete"
                color="error"
                variant="text"
                @click="removerItem(index)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      
      <v-alert
        v-else
        type="info"
        class="mt-4"
        text="Nenhum item adicionado ao orçamento. Adicione itens usando o formulário acima."
      ></v-alert>
    </v-card-text>
  </v-card>
</template>