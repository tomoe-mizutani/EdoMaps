<template>
  <div>
  <b-navbar type="dark" variant="dark" class="header" fixed="top">
    <b-navbar-brand href="#">Tokugawa Map</b-navbar-brand>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Documentation</b-nav-item>
        <b-nav-item href="#">About Us</b-nav-item>
        <b-nav-item href="#">Contact</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#">EN / JP</b-nav-item>
        <b-nav-item v-b-modal.modal-lg>Settings</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <b-modal id="modal-lg" size="lg" title="Advanced Settings">
    <b-card title="Uncertainties">
      <p>Select which domain to prioritize when ownership is uncertain.</p>
      <b-form-group>
        <b-form-radio v-model="selected" name="some-radios" value="A">Newcomer</b-form-radio>
        <b-form-radio v-model="selected" name="some-radios" value="B">Incumbent</b-form-radio>
        <b-form-radio v-model="selected" name="some-radios" value="B">Midpoint</b-form-radio>
      </b-form-group>
    </b-card>
    <!-- <template v-slot:modal-footer> -->
      <!-- <div class="w-100">
        <b-button
          variant="primary"
          class="float-right"
          @click="show=false"
        >
          Save
        </b-button>
        <b-button
          variant="outline-primary"
          class="float-right"
          @click="show=false"
        >
          Cancel
        </b-button>
      </div> -->
    <!-- </template> -->
  </b-modal>
</div>
</template>

<script>
</script>
<style>
.card-title {
  font-size: 1.2em;
}
.b-button{
  padding: 10px;
}
</style>
