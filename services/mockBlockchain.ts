import { PhoneRecord, Transaction } from '../types';

// Initial Mock Data described in user flow
const MOCK_PHONES: PhoneRecord[] = [
    {
        id: '1',
        imei: '358402100159201',
        model: 'IPHONE 16 ULTRA',
        manufacturer: 'CHAIN_MFG_LTD',
        currentOwner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        status: 'Manufactured',
        timestamp: new Date('2024-01-15').toISOString(),
        history: [
            {
                from: '0x0000...0000',
                to: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                action: 'MINT',
                timestamp: new Date('2024-01-15').toISOString(),
                txHash: '0xabc...123'
            }
        ]
    }
];

// In-memory store (simulation)
let phoneStore = [...MOCK_PHONES];

export const mockBlockchain = {
    // Add Phone
    addPhone: async (imei: string, model: string, owner: string): Promise<boolean> => {
        // Check if exists
        if (phoneStore.find(p => p.imei === imei)) return false;

        const newPhone: PhoneRecord = {
            id: Math.random().toString(36).substr(2, 9),
            imei,
            model,
            manufacturer: 'CHAIN_MFG_LTD',
            currentOwner: owner,
            status: 'Manufactured',
            timestamp: new Date().toISOString(),
            history: [
                {
                    from: '0x0000000000000000000000000000000000000000',
                    to: owner,
                    action: 'MINT_GENESIS',
                    timestamp: new Date().toISOString(),
                    txHash: '0x' + Math.random().toString(16).substr(2, 40)
                }
            ]
        };

        phoneStore.push(newPhone);
        return true;
    },

    // Transfer Phone
    transferPhone: async (imei: string, newOwner: string, currentOwner: string): Promise<boolean> => {
        const phone = phoneStore.find(p => p.imei === imei);
        if (!phone) return false;
        // In strict mode we'd check currentOwner, but for mock demo we allow it or check casually
        // if (phone.currentOwner !== currentOwner) return false;

        phone.currentOwner = newOwner;
        phone.history.push({
            from: currentOwner,
            to: newOwner,
            action: 'TRANSFER_OWNERSHIP',
            timestamp: new Date().toISOString(),
            txHash: '0x' + Math.random().toString(16).substr(2, 40)
        });
        return true;
    },

    // Get Phone (Track/Verify)
    getPhone: async (imei: string): Promise<PhoneRecord | null> => {
        return phoneStore.find(p => p.imei === imei) || null;
    }
};
