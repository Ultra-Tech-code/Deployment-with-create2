import { ethers } from "hardhat";

async function main() {
  const Factory = await ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();

  await factory.deployed();

  console.log(`factory deployed to ${factory.address}`);

         /** Interact with the factory contract */
  const contract = await ethers.getContractAt("Factory", factory.address);

    //Get bytecode of a contract
  const bytecode = await contract.getContractBytecode("0x12896191de42EF8388f2892Ab76b9a728189260A", "SimpleWallet");
  console.log(bytecode);

  //generate bytes value of a number
  const salt = await contract.generateBytes(1);
  console.log("bytes of salt", salt);

  //get pre computed address of a contract
  const getAddress = await contract.getAddress(salt, bytecode);
  console.log("Pre computed address", getAddress);

  //deploy the contract
  const createContract = await contract.createContract(salt, bytecode);
  const txreceipt =  await createContract.wait()
  //@ts-ignore
  const txargs = txreceipt.events[0].args;
  //@ts-ignore
  const contractAddress = await txargs.contractAddress
  console.log("deployed address", contractAddress);

  /**Interact with the simple wallet contract */
  const TestContract = await ethers.getContractAt("TestContract", contractAddress);

  //Get the wallet Name
  const walletName = await TestContract.walletName();
  console.log("wallet name", walletName);

  const admin = await TestContract.admin();
  console.log("admin", admin);


/**if you try to create a contract with the same bytecode and salt again. It revert because "Contract already created"*/
//to deploy a replica of the contract, you need to change the salt value
  //const createContractagain = await contract.createContract(salt, bytecode);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
