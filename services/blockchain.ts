
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants';

export const getEthereumContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");

    // 1. Force Switch Network using raw request BEFORE creating the provider.
    // This prevents Ethers from caching the old network and crashing when it changes.
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') { // 0xaa36a7 is Sepolia (11155111)
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }],
            });
        } catch (switchError: any) {
            // This error code 4902 means the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0xaa36a7',
                            chainName: 'Sepolia Test Network',
                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                            nativeCurrency: {
                                name: 'SepoliaETH',
                                symbol: 'SEP',
                                decimals: 18,
                            },
                        },
                    ],
                });
            } else {
                throw switchError;
            }
        }
    }

    // 2. Now that we are on Sepolia, initialize Ethers.
    // It will latch onto the correct network immediately.
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const blockchainService = {
    async addPhone(imei: string, model: string) {
        const contract = await getEthereumContract();
        const tx = await contract.addPhone(imei, model);
        await tx.wait();
        return tx;
    },

    async transferPhone(imei: string, newOwner: string) {
        const contract = await getEthereumContract();
        const tx = await contract.transferPhone(imei, newOwner);
        await tx.wait();
        return tx;
    },

    async getPhone(imei: string) {
        const contract = await getEthereumContract();
        try {
            const data = await contract.getPhone(imei);
            return {
                imeiHash: data[0],
                modelHash: data[1],
                manufacturer: data[2],
                currentOwner: data[3],
                timestamp: Number(data[4]) * 1000 // Convert to ms
            };
        } catch (error) {
            console.error("Error fetching phone from chain:", error);
            return null;
        }
    },

    async getPhoneHistory(imei: string) {
        const contract = await getEthereumContract();
        try {
            // Hash the IMEI to match the indexed topic
            const imeiHash = ethers.solidityPackedKeccak256(["string"], [imei]);

            // Query Events
            const addedFilter = contract.filters.PhoneAdded(imeiHash);
            const transferFilter = contract.filters.OwnershipTransferred(imeiHash);

            const [addedEvents, transferEvents] = await Promise.all([
                contract.queryFilter(addedFilter),
                contract.queryFilter(transferFilter)
            ]);

            // Format Events
            const history = [
                ...addedEvents.map(e => ({
                    type: 'MINT',
                    // @ts-ignore
                    data: { manufacturer: e.args[2], timestamp: Number(e.args[3]) * 1000 },
                    blockNumber: e.blockNumber,
                    txHash: e.transactionHash
                })),
                ...transferEvents.map(e => ({
                    type: 'TRANSFER',
                    // @ts-ignore
                    data: { from: e.args[1], to: e.args[2], timestamp: Number(e.args[3]) * 1000 },
                    blockNumber: e.blockNumber,
                    txHash: e.transactionHash
                }))
            ].sort((a, b) => b.data.timestamp - a.data.timestamp); // Newest first

            return history;

        } catch (error) {
            console.error("Error fetching history:", error);
            return [];
        }
    }
};
