const Accounts = require("./Functions/Accounts");
const Contracts = require("./Functions/Contracts");
const WINcoin = require("./Contracts/Wincoin");
const Web3 = require("./Functions/Web3");

const adminAddress = "0xD0235585d6C6BAE00B14bA249445a41CB589765d";
const anotherAddress = "0xee6414C8a8DE5cdc6fb3000BD6cBcE320017F399";
let deployedAddress = "0x6400bE5392B82Aabd9845FBDB37C28A8703A553D";

async function createContract() {
  let account = adminAddress;
  let contract = new Contracts.Contract({
    abi: WINcoin.abi,
    bytecode: WINcoin.bytecode,
    account: account,
  });
  await contract.deployContract();
  deployedAddress = contract.contract.options.address;
  return contract;
}

async function loadContract(abi, address) {
  let contract = new Contracts.Contract({ abi: abi, address: address });
  return contract;
}

async function test() {
  const instance = await createContract();

  // let name = await instance.name();
  // console.assert(name === "Sakon");

  // let symbol = await instance.symbol();
  // console.assert(symbol === "WIN");

  // //const instance = await loadContract(WINcoin.abi, deployedAddress);
  // var balanceAdmin = await instance.balanceOf(adminAddress);
  // //console.log(balanceAdmin);
  // console.assert(balanceAdmin === Math.pow(10, 6));
  // var balanceAnother = await instance.balanceOf(anotherAddress);
  // //console.log(balanceAnother);
  // console.assert(balanceAnother === 0);

  // await instance.transfer(adminAddress, anotherAddress, 100000);
  // balanceAdmin = await instance.balanceOf(adminAddress);
  // //console.log(balanceAdmin);
  // console.assert(balanceAdmin === 9 * Math.pow(10, 5));
  // balanceAnother = await instance.balanceOf(anotherAddress);
  // //console.log(balanceAnother);
  // console.assert(balanceAnother === Math.pow(10, 5));

  // await instance.approve(adminAddress, anotherAddress, 100000);
  // let allowance = await instance.allowance(adminAddress, anotherAddress);
  // console.assert(allowance === 100000);

  // await instance.mint(adminAddress, 100000);
  // balanceAdmin = await instance.balanceOf(adminAddress);
  // console.assert(balanceAdmin === Math.pow(10, 6));

  // await instance.transferFrom(adminAddress, anotherAddress, 50000);
  // balanceAdmin = await instance.balanceOf(adminAddress);
  // console.assert(balanceAdmin === 9.5 * Math.pow(10, 5));
  // balanceAnother = await instance.balanceOf(anotherAddress);
  // console.assert(balanceAnother === 1.5 * Math.pow(10, 5));

  // allowance = await instance.allowance(adminAddress, anotherAddress);
  // console.assert(allowance === 50000);

  // await instance.transferFrom(adminAddress, anotherAddress, 100000); // transfer amount exceeds allowance.

  // await instance.mint(anotherAddress, 100000); // error admin only

  // await instance.burn(adminAddress, 50000);
  // balanceAdmin = await instance.balanceOf(adminAddress);
  // console.assert(balanceAdmin === 9 * Math.pow(10, 5));

  // await instance.burn(anotherAddress, 100000); // error admin only

  // await instance.increaseAllowance(adminAddress, anotherAddress, 50000);
  // allowance = await instance.allowance(adminAddress, anotherAddress);
  // console.assert(allowance === 100000);

  // await instance.decreaseAllowance(adminAddress, anotherAddress, 50000);
  // allowance = await instance.allowance(adminAddress, anotherAddress);
  // console.assert(allowance === 50000);

  // await instance.decreaseAllowance(
  //   adminAddress,
  //   anotherAddress,
  //   Math.pow(10, 9)
  // ); // below zero
  // allowance = await instance.allowance(adminAddress, anotherAddress);
  // console.assert(allowance === 50000);
}

// test();

// createContract();
// mint(anotherAddress, 10);
// balanceOf(anotherAddress);
