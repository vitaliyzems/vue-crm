<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>{{ 'Record history' | localizeFilter }}</h3>
      </div>

      <div class="history-chart">
        <canvas ref="canvas"></canvas>
      </div>

      <Loader v-if="loading" />

      <p class="center" v-else-if="!records.length">
        {{ 'No records yet' | localizeFilter }}
      </p>

      <section v-else>
        <HistoryTable :records="items" :page="page" :pageSize="pageSize" />
        <Paginate
          v-model="page"
          :page-count="pageCount"
          :click-handler="changePageHandler"
          :container-class="'pagination'"
          :page-class="'waves-effect'"
          :prev-text="'Prev' | localizeFilter"
          :next-text="'Next' | localizeFilter"
        />
      </section>
    </div>
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import paginationMixin from '@/mixins/pagination.mixin';
import HistoryTable from '@/components/HistoryTable.vue';

export default {
  name: 'history',
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
  }),
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords');
    this.records = records.sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date)
    );
    const categories = await this.$store.dispatch('fetchCategories');

    this.setup(categories);

    this.loading = false;
  },
  methods: {
    setup(categories) {
      this.setupPagination(
        this.records.map((r) => ({
          ...r,
          categoryName: categories.find((c) => c.id === r.categoryId).title,
          typeClass: r.type === 'income' ? 'green' : 'red',
          typeText: r.type === 'income' ? 'Доход' : 'Расход',
        }))
      );
      this.renderChart({
        labels: categories.map((c) => c.title),
        datasets: [
          {
            label: 'Расходы по категориям',
            data: categories.map((c) => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === 'outcome') {
                  total += +r.amount;
                }
                return total;
              }, 0);
            }),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    },
  },
  components: {
    HistoryTable,
  },
};
</script>
