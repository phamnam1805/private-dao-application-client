import DAOManager from "src/assets/abis/DAOManager.json";

export default class DAOManagerContract {
  constructor(web3, contractAddress) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.contract = new web3.eth.Contract(DAOManager, contractAddress);
  }

  async daoCounter() {
    return await this.contract.methods.daoCounter().call();
  }

  async daos(index) {
    return await this.contract.methods.daos(index).call();
  }

  async distributedKeyId() {
    return await this.contract.methods.distributedKeyID().call();
  }

  createDAO(index, config, descriptionHash, accountAddress) {
    return this.contract.methods.createDAO(index, config, descriptionHash).send({ from: accountAddress });
  }
}
