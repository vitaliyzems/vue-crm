<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>{{ 'Categories' | localizeFilter }}</h3>
      </div>
      <section>
        <Loader v-if="loading" />
        <div class="row" v-else>
          <CategoryCreate @created="addCategory" />

          <CategoryEdit
            v-if="categories.length"
            :categories="categories"
            @updated="updateCategories"
            :key="categories.length + updateCount"
          />
          <p class="center" v-else>
            {{ 'No categories yet' | localizeFilter }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate';
import CategoryEdit from '@/components/CategoryEdit';

export default {
  name: 'categories',
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0,
  }),
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;
  },
  methods: {
    addCategory(category) {
      this.categories.unshift(category);
    },
    updateCategories({ id, title, limit }) {
      const idx = this.categories.findIndex((c) => c.id === id);
      this.categories[idx].title = title;
      this.categories[idx].limit = limit;
      this.updateCount++;
    },
  },
  components: { CategoryCreate, CategoryEdit },
};
</script>
