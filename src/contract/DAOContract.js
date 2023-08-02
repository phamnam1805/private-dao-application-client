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

  async proposalIDs(index) {
    return await this.contract.methods.proposalIDs(index).call();
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

  async createDAO(index, config, descriptionHash, accountAddress) {
    return await this.contract.methods.createDAO(index, config, descriptionHash).send({ from: accountAddress });
  }
}
