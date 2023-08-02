import DKG from "src/assets/abis/DKG.json";

export default class DKGContract {
  constructor(web3, contractAddress) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.contract = new web3.eth.Contract(DKG, contractAddress);
  }

  async distributedKeyCounter() {
    return await this.contract.methods.distributedKeyCounter().call();
  }

  async distributedKeys(index) {
    return await this.contract.methods.distributedKeys(index).call();
  }

  async tallyTrackers(requestID) {
    return await this.contract.methods.tallyTrackers(requestID).call();
  }

  async generateDistributedKey(dimension, distributedKeyType, accountAddress) {
    return await this.contract.methods
      .generateDistributedKey(dimension, distributedKeyType)
      .send({ from: accountAddress });
  }

  submitRound1Contribution(distributedKeyID, round1Contribution, accountAddress) {
    return this.contract.methods
      .submitRound1Contribution(distributedKeyID, round1Contribution)
      .send({ from: accountAddress });
  }

  submitRound2Contribution(distributedKeyID, round2Contribution, accountAddress) {
    return this.contract.methods
      .submitRound2Contribution(distributedKeyID, round2Contribution)
      .send({ from: accountAddress });
  }

  submitTallyContribution(requestID, tallyContribution, accountAddress) {
    return this.contract.methods
      .submitTallyContribution(requestID, tallyContribution)
      .send({ from: accountAddress });
  }

  submitTallyResult(requestID, result, proof, accountAddress) {
    return this.contract.methods.submitTallyResult(requestID, result, proof).send({ from: accountAddress });
  }
}
