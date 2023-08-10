import FundManager from "src/assets/abis/FundManager.json";

export default class FundManagerContract {
  constructor(web3, contractAddress) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.contract = new web3.eth.Contract(FundManager, contractAddress);
  }

  async config() {
    return await this.contract.methods.config().call();
  }

  async fundingRoundCounter() {
    return await this.contract.methods.fundingRoundCounter().call();
  }

  async fundingRounds(index) {
    return await this.contract.methods.fundingRounds(index).call();
  }

  async fundingRoundQueue() {
    return await this.contract.methods.fundingRoundQueue().call();
  }

  async requests(requestID) {
    return await this.contract.methods.requests(requestID).call();
  }

  async startTallying(fundingRoundID, accountAddress) {
    return await this.contract.methods.startTallying(fundingRoundID).send({ from: accountAddress });
  }

  async finalizeFundingRound(fundingRoundID, accountAddress) {
    return await this.contract.methods.finalizeFundingRound(fundingRoundID).send({ from: accountAddress });
  }

  launchFundingRound(distributedKeyID, accountAddress) {
    return this.contract.methods.launchFundingRound(distributedKeyID).send({ from: accountAddress });
  }

  fund(fundingRoundID, commitment, R, M, proof, accountAddress, value) {
    return this.contract.methods.fund(fundingRoundID, commitment, R, M, proof).send({ from: accountAddress, value: value });
  }

  refund(fundingRoundID, accountAddress) {
    return this.contract.methods.refund(fundingRoundID).send({ from: accountAddress });
  }
}
