import apiService from '../services/api.service';

/* eslint-disable no-param-reassign */
const initialState = {
  freelancers: [],
  perPage: 20,
  page: 1,
  total: 0,
  category: null,
  term: null,
};

const actions = {
  /**
   * Get initial load of freelancers in search
   * @param state
   * @param commit
   * @return {Promise<void>}
   */
  async getFreelancers({ state, commit }) {
    const params = {
      page: state.page,
      perPage: state.perPage,
      category: state.category,
      q: state.term,
    };
    try {
      const res = await apiService.get('/freelancers', { params });
      commit('setFreelancers', res.data.data.hits);
      commit('setTotal', res.data.data.total);
    } catch (err) {
      commit('setFreelancers', []);
      commit('setTotal', 0);
      throw err;
    }
  },

  /**
   * Next page in freelancers search
   * @param state
   * @param commit
   * @return {Promise<void>}
   */
  async nextFreelancers({ state, commit }) {
    if (state.total > (state.page * state.perPage)) {
      commit('increasePage');
      const params = {
        page: state.page,
        perPage: state.perPage,
        category: state.category,
        q: state.term,
      };
      try {
        const res = await apiService.get('/freelancers', { params });
        commit('addFreelancers', res.data.data.hits);
        commit('setTotal', res.data.data.total);
      } catch (err) {
        throw err;
      }
    }
  },
};

const mutations = {
  /**
   * Set fetched freelancers
   * @param state
   * @param freelancers
   */
  setFreelancers(state, freelancers) {
    state.freelancers = freelancers;
  },

  /**
   * Add more freelancers
   * @param state
   * @param freelancers
   */
  addFreelancers(state, freelancers) {
    state.freelancers = [...state.freelancers, ...freelancers];
  },

  /**
   * Set total number of freelancers in query
   * @param state
   * @param {Number} total
   */
  setTotal(state, total) {
    state.total = total;
  },

  /**
   * Set search term
   * @param state
   * @param term
   */
  setSearchTerm(state, term) {
    state.term = term;
  },

  /**
   * Set category for filtering freelancers
   * @param state
   * @param category
   */
  setCategory(state, category) {
    state.category = category;
  },

  /**
   * Reset page count
   * @param state
   */
  resetPage(state) {
    state.page = 1;
  },

  /**
   * Increase page number for infinite load
   * @param state
   */
  increasePage(state) {
    if (state.total > (state.page * state.perPage)) {
      state.page += 1;
    }
  },
};

const getters = {};

const store = {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
  getters,
};

export default store;
