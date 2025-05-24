<script setup lang="ts">
// This component displays the fixed observations about warranty and execution timeframe
</script>

<template>
  <v-card outlined class="mb-6">
    <v-card-title class="text-subtitle-1 text-sm-h6 primary lighten-1 white--text pa-3 pa-sm-4">
      Observações
    </v-card-title>
    
    <v-card-text class="pa-2 pa-sm-4 text-left">
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-shield-check">
          <v-list-item-title class="text-body-2 text-sm-body-1">Garantia: 90 dias</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-calendar-clock">
          <v-list-item-title class="text-body-2 text-sm-body-1">Execução: até 3 dias úteis após depósito inicial</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-information">
          <v-list-item-title class="text-body-2 text-sm-body-1">Este orçamento tem validade de 15 dias</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.v-card,
.v-card-title,
.v-card-text,
.v-list,
.v-list-item {
  box-sizing: border-box !important;
  max-width: 100vw !important;
  
}
</style>