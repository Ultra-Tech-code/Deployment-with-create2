import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFactory() {
    const Factory = await ethers.getContractFactory("Factory");
    const factory = await Factory.deploy();
  
    await factory.deployed();
  
    console.log(`factory deployed to ${factory.address}`);
    const factoryContrcat = factory.address;
  

    return { factoryContrcat};
  }

    describe("Verify Address", function () {
      it("verify that precomopute address is the same as the deployed address", async function () {
        const { factoryContrcat } = await loadFixture(deployFactory);

        //get bytecode of a contract
        const address = "0x12896191de42EF8388f2892Ab76b9a728189260A"
        const name = "SimpleWallet"        
        const Factory = await ethers.getContractAt("Factory", factoryContrcat);
        const bytecode = await Factory.getContractBytecode(address, name);


        //get salt value (bytes)
        const saltParam = 1;
        const salt = await Factory.generateBytes(saltParam);

        //get pre computed address of a contract
        const precomputedAddress = await Factory.getAddress(salt, bytecode);

        //deploy the contract
        const createContract = await Factory.createContract(salt, bytecode);
        const txreceipt =  await createContract.wait()
        //@ts-ignore
        const txargs = txreceipt.events[0].args;
        //@ts-ignore
        const contractAddress = await txargs.contractAddress

         expect(await contractAddress).to.equal(precomputedAddress);
    });
  });
});
