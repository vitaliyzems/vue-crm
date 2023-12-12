<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>{{ 'Profile' | localizeFilter }}</h3>
      </div>

      <form class="form" @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="description"
            type="text"
            v-model="name"
            :class="{ invalid: $v.name.$dirty && !$v.name.required }"
          />
          <label for="description">{{ 'Name' | localizeFilter }}</label>
          <small
            class="helper-text invalid"
            v-if="$v.name.$dirty && !$v.name.required"
            >{{ 'Name must not be empty' | localizeFilter }}</small
          >
        </div>

        <div class="switch">
          <label>
            English
            <input type="checkbox" v-model="isRuLocale" />
            <span class="lever"></span>
            Русский
          </label>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Update' | localizeFilter }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  data: () => ({
    name: '',
    isRuLocale: true,
  }),
  validations: {
    name: { required },
  },
  mounted() {
    this.name = this.info.name;
    this.isRuLocale = this.info.locale === 'ru-RU';
    setTimeout(() => {
      M.updateTextFields();
    });
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.updateUserInfo({
          name: this.name,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US',
        });
      } catch (e) {}
    },
  },
  computed: {
    ...mapGetters(['info']),
  },
};
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
