<template>
  <div class="task row" v-if="application">
    <div class="col-3 pt-5">
      <left-menu/>
    </div>
    <div class="col-6">
      <h1>{{task.title}}</h1>
      <small-employer :employer="application.client" class="mb-5"/>

      <b-tabs>
        <b-tab title="Project details" class="py-4">
          {{task.description}}
        </b-tab>
        <b-tab title="Messages">
          <chat-container :task="task" :application="application"/>
        </b-tab>
      </b-tabs>
    </div>
    <div class="col-2">
      <task-details class="mt-7" :task="task" :applicable="false"/>
      <required-skills class="skills" :skills="task.skills" v-if="task.skills"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LeftMenu from '../layout/LeftMenu.vue';
import SmallEmployer from './SmallEmployer.vue';
import TaskDetails from './TaskDetails.vue';
import RequiredSkills from './RequiredSkills.vue';
import ChatContainer from './chat/ChatContainer.vue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ApplicationFreelancer',
  components: {
    ChatContainer,
    RequiredSkills,
    TaskDetails,
    SmallEmployer,
    LeftMenu,
  },
  computed: {
    ...mapState('tasks', {
      application: state => state.selectedApplication,
    }),
    task() {
      return this.application ? this.application.task : {};
    },
  },
  created() {
    const id = parseInt(this.$route.params.id, 10);

    // get application data
    this.$store.dispatch('tasks/getApplication', id);

    // set messages as read for this application
    this.$store.dispatch('chat/readMessages', id);
  },
  destroyed() {
    // deselect application
    this.$store.commit('tasks/setSelectedApplication', {});
  },
};
</script>