// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TestContract.sol";

contract Factory {

    event NewContract(address indexed contractAddress);

    /**
     * @notice  . A function to Get bytecode of contract to be deployed
     * @dev     . returns bytes [bytes of TestContract + constructor argument]
     * @param   _owner  . An address[TestContract constructor arguments]
     * @param   _name  . A string[TestContract constructor arguments]
    */
    function getContractBytecode(address _owner, string calldata  _name) public pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_owner, _name));
    }


    /**
     * @notice  . A function to Compute address of the contract to be deployed
     * @dev     . returns address where the contract will deployed to if deployed with create2
     * @param   salt: random bytes used to precompute an address
    */
    function getAddress(bytes32 salt, bytes memory bytecode) public view returns (address) {
        address predictedAddress = address(uint160(uint(keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this), 
                salt, 
                keccak256(bytecode) 
            )
        ))));
      
        return predictedAddress;
    }


    /**
     * @notice  . A function to create Contract using create2
     * @dev     . returns address of the new contract. revert if called with the same parameter more than once
     * @param   salt  . A random bytes used to precompute an address
     * @param   bytecode  .byte code of the contract to be deployed
    */
    function createContract(bytes32 salt, bytes memory bytecode) public{
        address contractAddress;
        assembly {
            contractAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(contractAddress)) {
                revert(0, 0)
            }
        }

        emit NewContract(contractAddress);
    }

     /**
     * @notice  . An helper function to get the bytes32 value of a number
     * @dev     . returns bytes32
     * @param   _salt  . A random uint value
    */
    function generateBytes(uint _salt) external pure returns(bytes32){
        bytes32 salt = bytes32(_salt);
        return salt;
        
    }
}