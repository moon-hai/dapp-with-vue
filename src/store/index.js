import { createStore, createLogger } from 'vuex'

import global from './global'
import dapp from './dapp'

const store = createStore ({
  modules: {
    global,
    dapp
  },

  strict: true,

  plugins: [createLogger()]
})

export default store
