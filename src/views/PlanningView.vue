<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>{{ 'Planning' | localizeFilter }}</h3>
        <h4>{{ info.bill | currencyFilter }}</h4>
      </div>

      <Loader v-if="loading" />

      <p class="center" v-else-if="!categories.length">
        {{ 'No categories yet' | localizeFilter }}.
        <router-link to="/categories">{{
          'Add category' | localizeFilter
        }}</router-link>
      </p>

      <section v-else>
        <div v-for="category in categories" :key="category.id">
          <p>
            <strong>{{ category.title }}:</strong>
            {{ category.spend | currencyFilter }}
            {{ 'Out of' | localizeFilter }}
            {{ category.limit | currencyFilter }}
          </p>
          <div class="progress" v-tooltip="category.tooltip">
            <div
              class="determinate"
              :class="[category.progressBarColor]"
              :style="{ width: category.progress + '%' }"
            ></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import currencyFilter from '@/filters/currency.filter';

export default {
  name: 'planning',
  data: () => ({
    loading: true,
    categories: [],
  }),
  computed: {
    ...mapGetters(['info']),
  },
  async mounted() {
    const categories = await this.$store.dispatch('fetchCategories');
    const records = await this.$store.dispatch('fetchRecords');

    this.categories = categories.map((c) => {
      const spend = records
        .filter((r) => r.categoryId === c.id)
        .filter((r) => r.type === 'outcome')
        .reduce((total, r) => (total += +r.amount), 0);

      const percent = (spend * 100) / c.limit;
      const progress = percent <= 100 ? percent : 100;
      const progressBarColor =
        percent < 60 ? 'green' : percent < 100 ? 'yellow' : 'red';

      const tooltip = `${
        c.limit - spend < 0 ? 'Лимит превышен на' : 'Осталось'
      } ${currencyFilter(Math.abs(c.limit - spend))}`;

      return {
        ...c,
        spend,
        progress,
        progressBarColor,
        tooltip,
      };
    });

    this.loading = false;
  },
};
</script>
]]
