const mutations = {
  ['SET_FLASH_MESSAGE'](state, payload) {
    state.flashMessage = {
      ...state.flashMessage,
      ...payload
    }
  },

  ['CLEAR_FLASH_MESSAGE'](state) {
    state.flashMessage.message = ''
  }
}

export default mutations
