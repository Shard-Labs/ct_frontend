<template>
  <div class="auth-form">
    <h1 class="h1-sm mb-5 text-center text-lg-left">Sign Up.</h1>

    <b-form @submit.prevent="register">
      <b-form-group>
        <b-form-input
          v-model="form.email"
          type="email"
          size="lg"
          placeholder="Email"
          :state="$v.form.email.$dirty ? !$v.form.email.$error : null"/>
      </b-form-group>

      <b-form-group >
        <template slot="description">
          <div class="font-12-sm">{{passwordDescription}}</div>
        </template>

        <b-form-input
          v-model="form.password"
          type="password"
          size="lg"
          placeholder="Password"
          :state="$v.form.password.$dirty ? !$v.form.password.$error : null"/>
      </b-form-group>

      <b-form-group>
        <b-form-input
          v-model="form.passwordConfirmation"
          type="password"
          size="lg"
          placeholder="Password Confirmation"
          :state="$v.form.passwordConfirmation.$dirty
          ? !$v.form.passwordConfirmation.$error : null"/>
      </b-form-group>

      <b-button type="submit" size="lg" block variant="primary" class="mb-3" :disabled="sending">
        <template v-if="!sending">Sign Up for CryptoTask</template>
        <template v-if="sending">Saving...</template>
      </b-button>

      <p class="text-muted">
        <small class="font-12-sm">
          By clicking “Sign up for CryptoTask”, you agree to our Terms of Service
          and Privacy Statement. We’ll occasionally send you account related emails.
        </small>
      </p>
    </b-form>
  </div>
</template>

<script>
import {
  required, minLength, email, sameAs,
} from 'vuelidate/lib/validators';

const initialForm = {
  email: null,
  password: null,
  passwordConfirmation: null,
  role: null,
};

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'RegisterForm',
  data() {
    return {
      form: Object.assign({}, initialForm),
      sending: false,
      passwordDescription: `Make sure it's at least 15 characters OR at least
      8 characters including a number and a lowercase letter.`,
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(8),
      },
      passwordConfirmation: {
        required,
        minLength: minLength(8),
        sameAsPassword: sameAs('password'),
      },
    },
  },
  methods: {
    /**
     * Register
     * @return {Promise<void>}
     */
    async register() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sending = true;

        try {
          this.form.role = this.registrationRole;

          await this.$store.dispatch('user/register', this.form);
          this.form = initialForm;
          this.$v.$reset();
          this.sending = false;
          this.$store.dispatch('ui/showNotification', {
            type: 'success',
            text: 'You are registered. Please check your email for confirmation',
          });
        } catch (err) {
          this.sending = false;
          this.$store.dispatch('ui/showNotification', {
            type: 'danger',
            text: `Something went wrong. ${err.response.data.message}`,
          });
        }
      }
    },
  },
  computed: {
    registrationRole() {
      return this.$store.state.user.registrationRole;
    },
  },
};
</script>
