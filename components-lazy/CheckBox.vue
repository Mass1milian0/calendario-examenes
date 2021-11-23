<template>
  <div>
    <label :for="id">{{shownName}}</label>
    <input
    :id="id"
    type="checkbox"
    :form="formId"
    :name="name"
    :value="value"
    class="border-2 border-black rounded-md">
  </div>
</template>

<script>
export default {
  name: 'CheckBox',
  props: {
    formId: String,
    id: String,
    name: String,
    value: String,
    shownName: String
  }
}
</script>
