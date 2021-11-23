<template>
<client-only>
  <div class="w-screen flex lg:flex-row flex-col">
    <div class="lg:w-3/5 w-full lg:my-auto border-2 border-black lg:mx-16 my-10">
      <Calendario />
    </div>
    <div class="lg:w-1/5 w-full lg:my-16 mt-10 border-2 border-black lg:ml-16 h-full lg:py-16">
      <form action="#" @submit.prevent="updateData" id="formulario-main">
        <div class="flex flex-col justify-around h-full px-3">
          <div class="flex flex-col">
            <Selector :options="universidadOptions" formId="formulario-main" id="universidad-options" name="universidad" placeholder="Seleccione universidad" />
            <Selector :options="carreraOptions" formId="formulario-main" id="universidad-options" name="universidad" placeholder="Seleccione carrera" />
            <Selector :options="cursoOptions" formId="formulario-main" id="universidad-options" name="universidad" placeholder="Seleccione curso" />
          </div>
          <div class="flex flex-col font-bold lg:mt-96">
            <CheckBox formId="formulario-main" id="conv-extraordinaria" name="conv" value="ext" shownName="Extraordinaria" />
            <CheckBox formId="formulario-main" id="conv-especial" name="conv" value="esp" shownName="Especial" />
          </div>
          </div>
      </form>
    </div>
  </div>
  </client-only>
</template>


<script>
const HOST = document.location.origin //FIXME cosa de alex
import Calendario from '~/components/Calendar.vue'
import CheckBox from '~/components/CheckBox.vue'
import Selector from '~/components/Selector.vue'
export default {
  components: { Calendario, CheckBox, Selector },
  computed: {
    async universidadOptions () {
      let options = []
      //response = await fetch(HOST + "/api/universidades")
      //console.log(response)
      return options
    },
    carreraOptions () {
      // Cambiar const por let.
      const options = []
      // Hacer cosas en la API para sacar las opciones de carreras.
      return options
    },
    cursoOptions () {
      return [1,2,3,4,5]
    }
  },
  methods: {
    updateData (data) {
      // Hacer llamada a API.
    }
  }
}
</script>
