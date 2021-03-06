<template>
  <b-form class="chat-input d-flex align-items-center w-100" @submit.prevent="send">

    <a href="#" @click.prevent="openUploader" class="attachments pl-3">
      <paperclip-icon size="1.5x"/>
    </a>

    <b-form-input v-model="message"
                  :disabled="uploading"
                  class="flex-grow-1"
                  :placeholder="inputPlaceholder"
                  @keyup.native="userTyping"/>

    <input type="file"
           class="d-none"
           name="files[]"
           :disabled="uploading"
           multiple
           ref="attachments"
           @change="uploadFiles($event.target.files)"/>

    <button type="submit" class="btn btn-round submit" :disabled="uploading">
      Send
    </button>
  </b-form>
</template>

<script>
import { PaperclipIcon } from 'vue-feather-icons';
import apiService from '../../../services/api.service';

const DEFAULT_PLACEHOLDER = 'Enter message';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ChatInput',
  components: {
    PaperclipIcon,
  },
  props: {
    application: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      message: null,
      uploading: false,
      errors: [],
      fileUrls: [],
      maxSize: 1024,
      timeout: null,
      uploadPercentage: 0,
    };
  },
  methods: {
    /**
     * Send message
     */
    send() {
      if (this.message) {
        this.$emit('send', this.message);
        this.message = null;
      }
    },

    /**
     * User is typing
     */
    userTyping(e) {
      if (e.key !== 'Enter') {
        const userName = this.$store.getters['user/getUserName'];
        this.$socket.emit('startedTyping', {
          applicationId: this.application.id,
          userName,
        });
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.$socket.emit('stoppedTyping', {
            applicationId: this.application.id,
            userName,
          });
        }, 2000);
      }
    },

    /**
     * Open native uploading dialog
     */
    openUploader(e) {
      e.preventDefault();
      this.$refs.attachments.click();
    },

    /**
     * Upload attachments
     * @param {Object[]} files
     * @return {Promise<void>}
     */
    async uploadFiles(files) {
      const { maxSize } = this;

      this.errors = [];
      this.uploading = true;

      if (files.length) {
        const formData = new FormData();

        Array.from(files)
          .forEach((f) => {
            const size = f.size / maxSize / maxSize;

            if (size > 1) {
              // check whether the size is greater than the size limit
              this.errors.push(`Selected image ${f.name} is too big.`);
            } else {
              formData.append('files', f);
            }
          });

        // submit file to api
        const response = await apiService.post('/files/multiple', formData, {
          headers: { 'content-type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentage = (progressEvent.loaded / progressEvent.total) * 100;
            this.uploadPercentage = Math.round(percentage);
          },
        });

        // Emit response as file entry
        this.$emit('attach', response.data.data);

        this.uploading = false;
        this.uploadPercentage = 0;
      }

      if (this.errors.length) {
        this.$store.dispatch('ui/showNotification', {
          type: 'danger',
          text: this.errors.join(' '),
        });
      }
    },
  },
  computed: {
    inputPlaceholder() {
      if (this.uploading) {
        return `${this.uploadPercentage}% uploading...`;
      }
      return DEFAULT_PLACEHOLDER;
    },
  },
};
</script>
