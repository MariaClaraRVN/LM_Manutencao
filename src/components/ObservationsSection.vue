<script setup lang="ts">
// Este componente exibe as observações fixas sobre garantia e prazo de execução
</script>

<template>
  <v-card outlined class="mb-6">
    <v-card-title class="text-h6 primary lighten-1 white--text">
      Observações
    </v-card-title>
    
    <v-card-text class="pa-4">
      <v-list>
        <v-list-item prepend-icon="mdi-shield-check">
          <v-list-item-title>Garantia: 90 dias</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-calendar-clock">
          <v-list-item-title>Execução: até 3 dias úteis após depósito inicial</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-information">
          <v-list-item-title>Este orçamento tem validade de 15 dias</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>