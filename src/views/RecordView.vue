<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>Новая запись</h3>
      </div>

      <Loader v-if="loading" />

      <p class="center" v-else-if="!categories.length">
        Категорий пока нет.
        <router-link to="/categories">Добавить категорию</router-link>
      </p>

      <form class="form" v-else @submit.prevent="addRecordHandler">
        <div class="input-field">
          <select ref="select" v-model="category">
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
          <label>Выберите категорию</label>
        </div>

        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="income"
              v-model="type"
            />
            <span>Доход</span>
          </label>
        </p>

        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
              v-model="type"
            />
            <span>Расход</span>
          </label>
        </p>

        <div class="input-field">
          <input
            id="amount"
            type="number"
            v-model.number="amount"
            :class="{
              invalid:
                ($v.amount.$dirty && !$v.amount.minValue) ||
                ($v.amount.$dirty && !$v.amount.required),
            }"
          />
          <label for="amount">Сумма</label>
          <span
            class="helper-text invalid"
            v-if="$v.amount.$dirty && !$v.amount.minValue"
            >Минимальное значение {{ $v.amount.$params.minValue.min }}</span
          >
          <span
            class="helper-text invalid"
            v-if="$v.amount.$dirty && !$v.amount.required"
            >Укажите минимальную величину</span
          >
        </div>

        <div class="input-field">
          <input
            id="description"
            type="text"
            v-model="description"
            :class="{
              invalid: $v.description.$dirty && !$v.description.required,
            }"
          />
          <label for="description">Описание</label>
          <span
            class="helper-text invalid"
            v-if="$v.description.$dirty && !$v.description.required"
            >Введите описание</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: 'income',
    amount: 1,
    description: '',
  }),
  validations: {
    description: { required },
    amount: { minValue: minValue(1), required },
  },
  computed: {
    ...mapGetters(['info']),
    canCreate() {
      if (this.type === 'income') {
        return true;
      }

      return this.info.bill >= this.amount;
    },
  },
  methods: {
    async addRecordHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      if (this.canCreate) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON(),
          });
          const bill =
            this.type === 'income'
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;

          await this.$store.dispatch('updateUserInfo', { bill });
          this.$message('Запись успешно добавлена');
          this.$v.$reset();
          this.amount = 1;
          this.description = '';
        } catch (e) {}
      } else {
        this.$message(
          `Недостаточно средств на счете. (не хватает ${
            this.amount - this.info.bill
          })`
        );
      }
    },
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;
    if (this.categories.length) {
      this.category = this.categories[0].id;
    }
    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select);
      M.updateTextFields();
    }, 0);
  },
  beforeDestroy() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
};
</script>
