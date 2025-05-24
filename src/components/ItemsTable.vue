<script setup lang="ts">
import { ref } from 'vue'
import type { Item } from '../types'

defineProps<{
  itens: Item[]
}>()

const emit = defineEmits<{
  'add-item': [item: Item]
  'remove-item': [index: number]
  'update-item': [index: number, item: Item]
}>()

// New item data
const novoItem = ref<Item>({
  quantidade: 1,
  descricao: '',
  valorTotal: 0
})

// Add a new item to the list
const adicionarItem = () => {
  if (!novoItem.value.descricao) {
    alert('Por favor, preencha a descrição!')
    return
  }
  
  emit('add-item', { ...novoItem.value })
  
  // Reset the form for a new item
  novoItem.value = {
    quantidade: 1,
    descricao: '',
    valorTotal: 0
  }
}

// Update an item in the list
const atualizarItem = (index: number, field: keyof Item, value: string | number) => {
  const item = { ...props.itens[index] }
  
  if (field === 'quantidade') {
    item[field] = typeof value === 'string' ? parseFloat(value) || 0 : value
  } else {
    item[field] = value as string
  }
  
  emit('update-item', index, item)
}

// Remove an item from the list
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
      <!-- Add new item form -->
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
        
        <v-col cols="12" sm="8">
          <v-text-field
            v-model="novoItem.descricao"
            label="Descrição"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Descrição é obrigatória']"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="2" class="d-flex align-center">
          <v-btn 
            color="primary" 
            @click="adicionarItem"
            prepend-icon="mdi-plus"
            class="ml-2 button"
            :disabled="!novoItem.descricao"
          >
            Adicionar
          </v-btn>
        </v-col>
      </v-row>
      
      <!-- Items table -->
      <v-table v-if="itens.length > 0" class="mt-4">
        <thead>
          <tr>
            <th class="text-left">Qtd</th>
            <th class="text-left">Descrição</th>
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
                @input="(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      atualizarItem(index, 'quantidade', target ? target.value : '');
                    }"></v-text-field>
            </td>
            <td>
              <v-text-field
                :value="item.descricao"
                variant="plain"
                density="compact"
                hide-details
                @input="(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      atualizarItem(index, 'descricao', target ? target.value : '');
                    }"></v-text-field>
            </td>
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

// ...existing code...
<style scoped>
/* Garante que a tabela não ultrapasse a largura da tela */
.v-table {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100vw !important;
  overflow-x: auto !important;
  display: block !important;
}

/* Ajusta colunas do formulário para mobile */
@media (max-width: 600px) {
  .v-row {
    gap: 0 !important;
  }
  .v-col {
    flex-basis: 100% !important;
    max-width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .v-btn {
    width: 100% !important;
    margin-left: 0 !important;
  }
}

/* Ajusta campos de texto para nunca ultrapassarem a tela */
.v-text-field {
  max-width: 100vw !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

@media (min-width: 600px) {
.button{
	max-width:100%;
 }
}

</style>