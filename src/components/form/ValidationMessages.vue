<template>
  <b-form-invalid-feedback :class="{'d-block': visible}">
    <template v-if="errorVisible('required')">
      {{title}} is required
    </template>
    <template v-if="errorVisible('integer')">
      {{title}} must be number
    </template>
    <template v-if="errorVisible('numeric')">
      {{title}} must be number
    </template>
    <template v-if="errorVisible('decimal')">
      {{title}} must be number
    </template>
    <template v-if="errorVisible('minValue')">
      {{title}} must be at least {{validation.$params.minValue.min}}
    </template>
    <template v-if="errorVisible('minLength')">
      {{title}} must have at least {{validation.$params.minLength.min}} value
    </template>
    <template v-if="errorVisible('maxLength')">
      {{title}} can't have more then {{validation.$params.maxLength.max}} characters
    </template>
    <template v-if="errorVisible('minLength')">
      {{title}} must have at least {{validation.$params.maxLength.max}} values
    </template>
  </b-form-invalid-feedback>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ValidationMessages',
  props: {
    title: {
      type: String,
      required: true,
    },
    validation: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    errorVisible(type) {
      return this.messages.indexOf(type) > -1;
    },
  },
  computed: {
    visible() {
      return this.validation && this.validation.$dirty && this.validation.$error;
    },

    messages() {
      const errors = [];

      Object.keys(this.validation.$params)
        .forEach((p) => {
          if (!this.validation[p]) {
            errors.push(p);
          }
        });

      return errors;
    },
  },
};
</script>
