<template>
  <b-modal :visible="displayed"
           @close="close"
           @cancel="close"
           @hidden="close"
           title="Leave your feedback"
           :ok-disabled="sending"
           :ok-title="okButtonText"
           @ok.prevent="saveRating">
    <b-form>
      <star-rate-group label="Rate"
                       class="mb-3"
                       v-model="formData.rate"
                       :validation="$v.formData.rate"/>

      <textarea-group label="Comment"
                      v-model="formData.message"
                      :validation="$v.formData.message"/>
    </b-form>
  </b-modal>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators';
import TextareaGroup from '../form/TextareaGroup.vue';
import StarRateGroup from '../form/StarRateGroup.vue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'FeedbackModal',
  components: {
    StarRateGroup,
    TextareaGroup,
  },
  data() {
    return {
      sending: false,
      formData: {
        rate: 0,
        message: null,
      },
    };
  },
  validations: {
    formData: {
      rate: {
        required,
        minValue: minValue(1),
      },
      message: {
        required,
      },
    },
  },
  computed: {
    /**
     * Is modal displayed
     * @return {boolean}
     */
    displayed() {
      return this.$store.state.tasks.feedbackModalDisplayed;
    },

    /**
     * Override OK button text
     * @return {string}
     */
    okButtonText() {
      return this.sending ? 'Saving...' : 'Save';
    },
  },
  methods: {
    close() {
      this.$store.commit('tasks/closeFeedbackModal');
      this.sending = false;
    },

    async saveRating() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.sending = true;
        this.$emit('save', this.formData);
      }
    },
  },
};
</script>
