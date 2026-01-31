
export const CONTRACT_ADDRESS = "0x5386320588F126C4d3da9d29939c5e7e87ad6c10";

export const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "imei",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "model",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
            }
        ],
        "name": "PhoneAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "imei",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_imei",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_model",
                "type": "string"
            }
        ],
        "name": "addPhone",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_imei",
                "type": "string"
            }
        ],
        "name": "getPhone",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "imeiHash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "modelHash",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "currentOwner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_imei",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "transferPhone",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
