<template>
  <input :id="id" type="text" :name="name" :form="formId" :placeholder="placeholder">
</template>

<script>
export default {
  name: 'SearchBox',
  props: {
    id: String,
    name: String,
    formId: String,
    placeholder: String
  }
}
</script>
