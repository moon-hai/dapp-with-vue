import Web3 from 'web3'
import createKeccakHash from 'keccak'
// eslint-disable-next-line no-unused-vars
let web3Instance

function toChecksumAddress(address) {
  address = address.toLowerCase().replace('0x', '')
  const hash = createKeccakHash('keccak256').update(address).digest('hex')
  let ret = '0x'

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

const actions = {
  async getMetamaskProvider({ commit }) {
    // check window ethereum provider
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum)
      try {
        await window.ethereum.enable()
        web3Instance = web3
      } catch(error) {
        commit('global/SET_FLASH_MESSAGE', { message: 'Please install Metamask', type: 'error' }, { root: true })
      }
      console.log('------------- web3 instance -------------------')
      console.log(web3Instance)
    } else {
      commit('global/SET_FLASH_MESSAGE', { message: 'Please install Metamask', type: 'error' }, { root: true })
    }
  },

  async getMetamaskInformation({ dispatch, commit }) {
    // step 1: check window ethereum provider
    await dispatch('getMetamaskProvider')
    if (!web3Instance) {
      commit('global/SET_FLASH_MESSAGE', { message: 'Please install Metamask', type: 'error' }, { root: true })
      return
    }

    // step 2: get account
    await dispatch('getMetamaskAccount')
  },

  async getMetamaskAccount({ commit, dispatch }) {
    await web3Instance.eth.getAccounts()
      .then(async accounts => {
        if (accounts.length > 0) {
          commit('STORE_METAMASK_ACCOUNT', {
            walletAddress: accounts[0]
          })
          commit('global/SET_FLASH_MESSAGE', { message: 'Success to connect account', type: 'success' }, { root: true })
          dispatch('observerProvider')
          await dispatch('getAccountBalance', accounts[0])
        } else {
          commit('global/SET_FLASH_MESSAGE', { message: 'Failed to connect account', type: 'error' }, { root: true })
        }
      })
      .catch(error => {
        throw error
      })
  },

  observerProvider({ commit, state, dispatch }) {
    if (!web3Instance) {
      commit('global/SET_FLASH_MESSAGE', { message: 'Please install Metamask', type: 'error' }, { root: true })
    } else {
      web3Instance.currentProvider.on('accountsChanged', async accounts => {
        if (!accounts.length) {
          commit('CLEAR_CURRENT_DATA')
          commit('global/SET_FLASH_MESSAGE', { message: 'Failed to connect account', type: 'error' }, { root: true })
        } else if (accounts[0] !== state.account) {
          commit('STORE_METAMASK_ACCOUNT', {
            walletAddress: accounts[0]
          })
          await dispatch('getAccountBalance', accounts[0])
        }
      })
    }
  },

  async getAccountBalance({ commit }, account) {
    await web3Instance.eth.getBalance(toChecksumAddress(account))
      .then(balance => {
        commit('STORE_METAMASK_ACCOUNT', {
          balance: balance / (Math.pow(10, 18))
        })
      })
      .catch(error => {
        throw error
      })
  },

  async sendETH({ state, commit }) {
    if (!web3Instance) {
      return commit('global/SET_FLASH_MESSAGE', { message: 'Please install Metamask', type: 'error' }, { root: true })
    }

    if (!state.account.walletAddress) {
      return commit('global/SET_FLASH_MESSAGE', { message: 'Please connect Metamask', type: 'error' }, { root: true })
    }

    commit('TOGGLE_LOADING')
    await web3Instance.eth.sendTransaction({
      from: state.account.walletAddress,
      to: toChecksumAddress('0xFF26D8EeD1F3bB936B15372D0a23fbF62965B44F'),
      value: Web3.utils.toWei('0.0005')
    }).then(res => {
      console.log(res)
      commit('STORE_TRANSACTION', res)
    })
    .catch(error => {
      throw error
    })
    .finally(() => {
      commit('TOGGLE_LOADING')
    })
  }
}

export default actions
