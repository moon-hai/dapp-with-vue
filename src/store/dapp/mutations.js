const mutations = {
  ['STORE_METAMASK_ACCOUNT'](state, payload) {
    state.account = {
      ...state.account,
      ...payload
    }
  },

  ['CLEAR_CURRENT_DATA'](state) {
    state.account = {}
    state.transactions = []
  },

  ['STORE_TRANSACTION'](state, payload) {
    state.transactions.push(payload)
  },

  ['TOGGLE_LOADING'](state) {
    state.waiting = !state.waiting
  }
}

export default mutations
