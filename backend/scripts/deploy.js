
const hre = require("hardhat");

async function main() {
  // Deploy the MockERC20 Token
  const ERC20Mock = await hre.ethers.getContractFactory("ERC20mock");
  const initialSupply = hre.ethers.utils.parseEther("1000000"); // 1 million tokens
  const energyToken = await ERC20Mock.deploy("EnergyToken", "ET", initialSupply);
  await energyToken.deployed();
  console.log("Mock ERC20 deployed at:", energyToken.address);

  const gridCompany = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; //19 ka wallet address
  
  const EnergyTrading = await hre.ethers.getContractFactory("EnergyTrading");
  const energyTrading = await EnergyTrading.deploy(gridCompany, energyToken.address);

  await energyTrading.deployed();

  console.log("EnergyTrading contract deployed at:", energyTrading.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//EnergyTrading contract deployed at: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
//Mock ERC20 deployed at: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9