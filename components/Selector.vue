<template>
  <div class="flex flex-col">
    <label :for="id">{{placeholder}}</label>
    <select :id="id" :name="name" :form="formId" :aria-placeholder="placeholder">
      <option v-for="option in options" :key="option" :value="option">{{option}}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Selector',
  props: {
    options: Array,
    formId: String,
    name: String,
    id: String,
    placeholder: String
  }
}
</script>
