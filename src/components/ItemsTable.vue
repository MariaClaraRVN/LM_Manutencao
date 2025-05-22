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
  <v-card outlined class="mb-4 mb-sm-6" :flat="$vuetify.display.xs">
    <v-card-title class="text-subtitle-1 text-sm-h6 primary lighten-1 white--text pa-3 pa-sm-4">
      Itens do Orçamento
    </v-card-title>
    
    <v-card-text class="pa-2 pa-sm-4">
      <!-- Formulário para adicionar novo item - layout responsivo -->
      <v-row align="center" dense>
        <!-- Quantidade -->
        <v-col cols="4" sm="2" class="py-1">
          <v-text-field
            v-model.number="novoItem.quantidade"
            type="number"
            label="$vuetify.display.xs ? 'Qtd' : 'Quantidade'"
            variant="outlined"
            density="compact"
            min="1"
            :rules="[v => v > 0 || 'Quantidade deve ser maior que zero']"
          ></v-text-field>
        </v-col>
        
        <!-- Descrição -->
        <v-col cols="8" sm="5" class="py-1">
          <v-text-field
            v-model="novoItem.descricao"
            label="Descrição"
            variant="outlined"
            density="compact"
            :rules="[v => !!v || 'Descrição é obrigatória']"
          ></v-text-field>
        </v-col>
        
        <!-- Valor Unitário - esconder label em mobile -->
        <v-col cols="7" sm="3" class="py-1">
          <v-text-field
            v-model.number="novoItem.valorUnitario"
            type="number"
            label="Valor Unitário (R$)"
            variant="outlined"
            density="compact"
            min="0"
            step="0.01"
            :rules="[v => v > 0 || 'Valor deve ser maior que zero']"
          ></v-text-field>
        </v-col>
        
        <!-- Botão Adicionar - ajustado para mobile -->
        <v-col cols="5" sm="2" class="py-1 d-flex align-center justify-end">
  <v-btn 
    color="primary" 
    @click="adicionarItem"
    :prepend-icon="$vuetify.display.smAndUp ? 'mdi-plus' : undefined"
    :icon="$vuetify.display.xs ? 'mdi-plus' : undefined"
    size="small"
    :class="{'ml-1': $vuetify.display.xs}"
    :disabled="!novoItem.descricao || novoItem.valorUnitario <= 0"
  >
    <span v-if="$vuetify.display.smAndUp">Adicionar</span>
    <span v-else class="sr-only" style="font-size: 25px">+</span> <!-- Acessibilidade para screen readers -->
  </v-btn>
</v-col>
      </v-row>
      
      <!-- Tabela de itens com scroll horizontal em mobile -->
      <div class="mobile-scroll-wrapper mt-3">
        <template v-if="itens.length > 0">
          <v-table class="item-table" fixed-header>
            <thead>
              <tr>
                <th class="text-left" :class="{'px-1': $vuetify.display.xs}">Qtd</th>
                <th class="text-left" :class="{'px-1': $vuetify.display.xs}">Descrição</th>
                <th class="text-right" :class="{'px-1': $vuetify.display.xs}">Unit.</th>
                <th class="text-right" :class="{'px-1': $vuetify.display.xs}">Total</th>
                <th class="text-center" :class="{'px-0': $vuetify.display.xs}">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in itens" :key="index">
                <!-- Quantidade -->
                <td :class="{'px-1': $vuetify.display.xs}">
                  <v-text-field
                    v-model.number="item.quantidade"
                    type="number"
                    variant="plain"
                    density="compact"
                    hide-details
                    min="1"
                    class="mobile-input"
                    @input="(e: Event) => atualizarItem(index, 'quantidade', (e.target as HTMLInputElement).value)"
                  ></v-text-field>
                </td>
                
                <!-- Descrição -->
                <td :class="{'px-1': $vuetify.display.xs}">
                  <v-text-field
                    v-model.string="item.descricao"
                    variant="plain"
                    density="compact"
                    hide-details
                    class="mobile-input"
                     @input="(e: Event) => atualizarItem(index, 'descricao', e.target.value)"
                  ></v-text-field>
                </td>
                
                <!-- Valor Unitário -->
                <td class="text-right" :class="{'px-1': $vuetify.display.xs}">
                  <v-text-field
                    v-model.number="item.valorUnitario"
                    type="number"
                    variant="plain"
                    density="compact"
                    hide-details
                    min="0"
                    step="0.01"
                    class="text-right mobile-input"
                     @input="(e: Event) => atualizarItem(index, 'valorUnitario', e.target.value)"
                  ></v-text-field>
                </td>
                
                <!-- Valor Total -->
                <td class="text-right" :class="{'px-1': $vuetify.display.xs}">
                  <span class="text-caption text-sm-body-2">
                    {{ formatCurrency(calcularValorTotal(item.quantidade, item.valorUnitario)) }}
                  </span>
                </td>
                
                <!-- Ações -->
                <td class="text-center" :class="{'px-0': $vuetify.display.xs}">
                  <v-btn
                    density="compact"
                    icon="mdi-delete"
                    color="error"
                    variant="text"
                    size="x-small"
                    @click="removerItem(index)"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </template>
        <template v-else>
          <!-- Mensagem quando não há itens -->
          <v-alert
            type="info"
            density="compact"
            variant="tonal"
            text="Nenhum item adicionado. Use o formulário acima."
            class="my-alert-background"
          ></v-alert>
        </template>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Ajustes específicos para iPhones */
@media (max-width: 428px) { /* iPhone 14 Pro Max, 12/13 Pro Max */
  .item-table {
    font-size: 0.75rem;
  }
  
  .v-text-field {
    font-size: 0.8rem !important;
  }
  .sr-only{
    font-size:16px
  }
}

@media (max-width: 390px) { /* iPhone 12, 13, 14, XR */
  .mobile-input :deep(.v-field__input) {
    padding-top: 6px !important;
    padding-bottom: 6px !important;
    min-height: 36px !important;
  }

    .sr-only{
    font-size:25px;
  }
}

@media (max-width: 375px) { /* iPhone SE, 6/7/8 */
  .item-table {
    font-size: 0.7rem;
  }
  
  .v-btn {
    min-width: 36px !important;
  }

    .sr-only{
    font-size:25px;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1024px) {
  .v-card {
    border-radius: 12px !important;
  }
  
  .v-table {
    font-size: 0.9rem;
  }
}

.my-alert-background {
  background-color: #e8f5e9; 
  border: 1px solid #996515; 
  border-radius: 4px;
  color: #000000 !important;
}

/* Scroll horizontal para a tabela em mobile */
.mobile-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-left: -8px;
  margin-right: -8px;
  padding-left: 8px;
  padding-right: 8px;
}

/* Melhorias para inputs em mobile */
.mobile-input :deep(.v-field) {
  background-color: transparent !important;
}

/* Ajuste para evitar zoom em inputs no iOS */
@media (max-width: 600px) {
  .mobile-input :deep(input) {
    font-size: 16px !important;
  }
}

/* Espaçamento reduzido em mobile */
.v-card-text {
  padding: 12px !important;
}

@media (min-width: 600px) {
  .v-card-text {
    padding: 16px !important;
  }
}

</style>