<template>
  <div class="app-page">
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{
          'History' | localizeFilter
        }}</router-link>
        <a @click.prevent class="breadcrumb">
          {{ record.type === 'income' ? 'Доход' : 'Расход' }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="record.type === 'income' ? 'green' : 'red'">
            <div class="card-content white-text">
              <p>
                {{ 'Description' | localizeFilter }}: {{ record.description }}
              </p>
              <p>
                {{ 'Amount' | localizeFilter }}:
                {{ record.amount | currencyFilter }}
              </p>
              <p>
                {{ 'Category' | localizeFilter }}: {{ record.categoryName }}
              </p>

              <small>{{ record.date | date('datetime') }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>{{ 'Record not found' | localizeFilter }}</p>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data: () => ({
    record: null,
    loading: true,
  }),
  async mounted() {
    const id = this.$route.params.id;
    const record = await this.$store.dispatch('fetchRecordById', id);
    if (!record) {
      this.record = null;
      this.loading = false;
      return;
    }
    const category = await this.$store.dispatch(
      'fetchCategoryById',
      record.categoryId
    );

    this.record = {
      ...record,
      categoryName: category.title,
    };

    this.loading = false;
  },
};
</script>
