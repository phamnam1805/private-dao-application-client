import DAO from "src/assets/abis/DAO.json";

export default class DAOContract {
  constructor(web3, contractAddress) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.contract = new web3.eth.Contract(DAO, contractAddress);
  }

  async descriptionHash() {
    return await this.contract.methods.descriptionHash().call();
  }

  async config() {
    return await this.contract.methods.config().call();
  }

  async proposalCounter() {
    return await this.contract.methods.proposalCounter().call();
  }

  async proposals(proposalID) {
    return await this.contract.methods.proposals(proposalID).call();
  }

  async actions(proposalID) {
    return await this.contract.methods.actions(proposalID).call();
  }

  async description(proposalID) {
    return await this.contract.methods.description(proposalID).call();
  }

  async requests(requestID) {
    return await this.contract.methods.requests(requestID).call();
  }

  async hashProposal(actions, descriptionHash) {
    return await this.contract.methods.hashProposal(actions, descriptionHash).call();
  }

  async tally(proposalId, accountAddress) {
    return await this.contract.methods.tally(proposalId).send({ from: accountAddress });
  }

  propose(actions, descriptionHash, accountAddress) {
    return this.contract.methods.propose(actions, descriptionHash).send({ from: accountAddress });
  }

  castVote(proposalId, voteData, accountAddress) {
    return this.contract.methods.castVote(proposalId, voteData).send({ from: accountAddress });
  }

  finalize(proposalId, accountAddress) {
    return this.contract.methods.finalize(proposalId).send({ from: accountAddress });
  }

  queue(proposalId, accountAddress) {
    return this.contract.methods.queue(proposalId).send({ from: accountAddress });
  }

  execute(proposalId, accountAddress) {
    return this.contract.methods.execute(proposalId).send({ from: accountAddress });
  }

  cancel(proposalId, accountAddress) {
    return this.contract.methods.cancel(proposalId).send({ from: accountAddress });
  }
}
