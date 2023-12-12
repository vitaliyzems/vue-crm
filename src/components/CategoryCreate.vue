<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="createCategoryHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{
              invalid: $v.title.$dirty && !$v.title.required,
            }"
          />
          <label for="name">Название</label>
          <span
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
            >Введите название</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model="limit"
            :class="{
              invalid:
                ($v.limit.$dirty && !$v.limit.minValue) ||
                ($v.limit.$dirty && !$v.limit.required),
            }"
          />
          <label for="limit">Лимит</label>
          <span
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            >Минимальное значение {{ $v.limit.$params.minValue.min }}</span
          >
          <span
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.required"
            >Укажите минимальную величину</span
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

export default {
  data: () => ({
    title: '',
    limit: 1,
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(1), required },
  },
  mounted() {
    M.updateTextFields();
  },
  methods: {
    async createCategoryHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const formData = { title: this.title, limit: this.limit };
      try {
        const category = await this.$store.dispatch('createCategory', formData);
        this.title = '';
        this.limit = 1;
        this.$v.$reset();
        this.$message('Категория успешно создана');
        this.$emit('created', category);
      } catch (e) {}
    },
  },
};
</script>
