<template>
  <div style="margin-top: 40px">
    <el-row :gutter="20">
    <el-col :span="1"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="8">
      <el-card v-loading="loading" class="box-card">
        <template #header>
          <div class="card-header">
            <span>Your account information</span>
          </div>
        </template>
        <div v-if="metamaskAccount.walletAddress" class="text item">
          <p>Address: <span style="font-weight: bold">{{ metamaskAccount.walletAddress }}</span></p>
          <p>Balance: <span style="font-weight: bold">{{ metamaskAccount.balance }} ETH</span></p>
        </div>
        <div v-else>
          <el-button class="button" type="text" @click="getMetamaskInformation">Connect Metamask</el-button>
        </div>
        <div v-if="metamaskAccount.walletAddress" class="bottom">
          <el-button type="text" class="button" @click="sendETH">Send ETH</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :span="14">
      <el-card v-loading="loading" class="box-card">
        <template #header>
          <div class="card-header">
            <span>Transactions</span>
          </div>
        </template>
        <template v-if="transactions.length">
          <div v-for="(tnx, index) in transactions" :key="index" class="text item" style="border-bottom: 1px solid #ccc">
            <p>
              Status:
              <i v-if="tnx.status" style="color: green" class="el-icon-success"></i>
              <i v-else style="color: red" class="el-icon-error"></i>
            </p>
            <p>From: <el-link type="primary" :href="`https://rinkeby.etherscan.io/address/${tnx.from}`" target="_blank">{{ tnx.from }}</el-link></p>
            <p>To: <el-link type="primary" :href="`https://rinkeby.etherscan.io/tx/${tnx.to}`" target="_blank">{{ tnx.to }}</el-link></p>
            <p>Tnx Hash: <el-link type="primary" :href="`https://rinkeby.etherscan.io/tx/${tnx.transactionHash}`" target="_blank">{{ tnx.transactionHash }}</el-link></p>
          </div>
        </template>
      </el-card>
    </el-col>
    <el-col :span="1"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: 'App',

  setup() {
    const store = useStore()
    const flashMessage = computed(() => store.state.global.flashMessage)
    const metamaskAccount = computed(() => store.state.dapp.account)
    const transactions = computed(() => store.state.dapp.transactions)
    const loading = computed(() => store.state.dapp.waiting)

    const getMetamaskInformation = () => store.dispatch('dapp/getMetamaskInformation')
    const sendETH = () => store.dispatch('dapp/sendETH')

    const showMessage = () => {
      const { type, message, duration } = flashMessage.value
      if (message) ElMessage({
        showClose: true,
        message,
        type,
        duration
      })
    }

    showMessage()
    watch(flashMessage, showMessage)

    return {
      // state
      metamaskAccount,
      transactions,
      loading,

      // methods
      getMetamaskInformation,
      sendETH
    }
  }
}
</script>
