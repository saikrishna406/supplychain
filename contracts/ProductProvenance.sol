// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductProvenance {
    struct Phone {
        bytes32 imeiHash;
        bytes32 modelHash;
        address manufacturer;
        address currentOwner;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => Phone) private phones;

    event PhoneAdded(
        bytes32 indexed imeiHash,
        bytes32 modelHash,
        address indexed manufacturer,
        uint256 timestamp
    );

    event OwnershipTransferred(
        bytes32 indexed imeiHash,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

    function addPhone(string calldata _imei, string calldata _model) external {
        require(bytes(_imei).length > 0, "IMEI required");
        require(bytes(_model).length > 0, "Model required");

        bytes32 imeiHash = keccak256(abi.encodePacked(_imei));
        require(!phones[imeiHash].exists, "Phone already exists");

        phones[imeiHash] = Phone(
            imeiHash,
            keccak256(abi.encodePacked(_model)),
            msg.sender,
            msg.sender,
            block.timestamp,
            true
        );

        emit PhoneAdded(
            imeiHash,
            keccak256(abi.encodePacked(_model)),
            msg.sender,
            block.timestamp
        );
    }

    function transferPhone(string calldata _imei, address _newOwner) external {
        require(_newOwner != address(0), "Invalid new owner");

        bytes32 imeiHash = keccak256(abi.encodePacked(_imei));
        Phone storage phone = phones[imeiHash];

        require(phone.exists, "Phone not found");
        require(phone.currentOwner == msg.sender, "Caller is not owner");

        address prev = phone.currentOwner;
        phone.currentOwner = _newOwner;

        emit OwnershipTransferred(
            imeiHash,
            prev,
            _newOwner,
            block.timestamp
        );
    }

    function getPhone(string calldata _imei)
        external
        view
        returns (
            bytes32,
            bytes32,
            address,
            address,
            uint256
        )
    {
        bytes32 hash = keccak256(abi.encodePacked(_imei));
        Phone storage phone = phones[hash];
        require(phone.exists, "Phone not found");

        return (
            phone.imeiHash,
            phone.modelHash,
            phone.manufacturer,
            phone.currentOwner,
            phone.timestamp
        );
    }
}
