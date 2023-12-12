<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">Счет в валюте</span>
        <p class="currency-line" v-for="currency of currencies" :key="currency">
          <span>{{ getCurrency(currency) | currencyFilter(currency) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rates'],
  data: () => ({
    currencies: ['KZT', 'USD', 'EUR'],
  }),
  computed: {
    origin() {
      return this.$store.getters.info.bill;
    },
  },
  methods: {
    getCurrency(currency) {
      return (this.origin * this.rates[currency]).toFixed(2);
    },
  },
};
</script>
