
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
//Mock ERC20 deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
//EnergyTrading contract deployed at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512