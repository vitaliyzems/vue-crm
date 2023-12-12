<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{ 'Amount' | localizeFilter }}</th>
        <th>{{ 'Date' | localizeFilter }}</th>
        <th>{{ 'Category' | localizeFilter }}</th>
        <th>{{ 'Type' | localizeFilter }}</th>
        <th>{{ 'Open' | localizeFilter }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(r, idx) in records" :key="r.id">
        <td>{{ pageSize * (page - 1) + idx + 1 }}</td>
        <td>{{ r.amount | currencyFilter }}</td>
        <td>{{ r.date | date('datetime') }}</td>
        <td>{{ r.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="r.typeClass">{{
            r.typeText
          }}</span>
        </td>
        <td>
          <button
            v-tooltip="'Посмотреть запись'"
            class="btn-small btn"
            @click="$router.push('/detail/' + r.id)"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    records: {
      require: true,
      type: Array,
    },
    page: {
      require: true,
      type: Number,
    },
    pageSize: {
      require: true,
      type: Number,
    },
  },
};
</script>
