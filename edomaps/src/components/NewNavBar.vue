<template>
  <div id="navbar">
    <b-navbar type="dark" variant="dark" class="header" fixed="top">
      <b-navbar-brand href="#">Edo Map</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Documentation</b-nav-item>
          <b-nav-item href="#">About Us</b-nav-item>
          <b-nav-item href="#">Contact</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item>EN / JP</b-nav-item>
          <b-nav-item @click="$bvModal.show('modal-settings')">Settings</b-nav-item>
          <b-modal id="test-modal" size="sm"></b-modal>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  <b-modal id="modal-settings" size="xl" title="Preferences">
    <b-card title="Domains">
      <p>Select whether or not to show branch domains.</p>
      <b-form-group>
        <b-form-radio v-model="form.domains.branch" value="Branch">Show branch domains</b-form-radio>
        <b-form-radio v-model="form.domains.branch" value="Main">Show branch domains as one domain</b-form-radio>
      </b-form-group>
      <p>Select whether to prioritize newcomer vs incumbent.</p>
      <b-form-group>
        <b-form-radio v-model="form.domains.uncertainty" value="Newcomer">Newcomer</b-form-radio>
        <b-form-radio v-model="form.domains.uncertainty" value="Incumbent">Incumbent</b-form-radio>
      </b-form-group>
      <p>Select whether to prioritize earliest vs latest change .</p>
      <b-form-group>
        <b-form-radio v-model="form.domains.uncertainTiming" value="Earliest">Earliest</b-form-radio>
        <b-form-radio v-model="form.domains.uncertainTiming" value="Latest">Latest</b-form-radio>
      </b-form-group>
      <p>Show domain by</p>
      <b-form-group>
        <b-form-radio v-model="form.domains.styling" value="Domain name">Domain name</b-form-radio>
        <b-form-radio v-model="form.domains.styling" value="Family name">Family name</b-form-radio>
        <b-form-radio v-model="form.domains.styling" value="Daimyo status">Daimyo status</b-form-radio>
      </b-form-group>
    </b-card>
    <b-card title="Villages">
      <p>Select whether or not to show subvillages.</p>
      <b-form-group>
        <b-form-radio v-model="form.villages" value="Small">Show subvillages</b-form-radio>
        <b-form-radio v-model="form.villages" value="Large">Show main villages</b-form-radio>
      </b-form-group>
    </b-card>
    <b-card title="Gun">
      <p>Select whether or not to show lumped guns.</p>
      <b-form-group>
        <b-form-radio v-model="form.guns" value="Small">Show small guns</b-form-radio>
        <b-form-radio v-model="form.guns" value="Lumped">Show lumped guns</b-form-radio>
      </b-form-group>
    </b-card>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button variant="primary" class="float-right" @click="changeSettings(); $bvModal.hide('modal-settings')"> Save</b-button> &nbsp;
        <b-button variant="outline-primary" class="float-left" @click="$bvModal.show('modal-settings')">Cancel</b-button>
      </div>
    </template>
  </b-modal>
  <!-- <div id="modal"><modal ref="modal"></modal></div> -->

</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        domains: {
          branch: 'Branch',
          uncertainty: 'Newcomer',
          uncertainTimin: 'Earliest',
          styling: 'Domain name'
        },
        villages: 'Small',
        guns: 'Small',
      }
    }
  },

  methods:{
    changeSettings(){
      this.$emit('changeSettings', this.form)
    },
  },
  mounted() {
  }
}
</script>
<style>
.card-title {
  font-size: 1.2em;
}
/* .w-100{
  margin-left: 15px;
} */

</style>
