
export { };

declare global {
    interface Window {
        ethereum?: any; // EIP-1193 Provider
        aistudio?: {
            hasSelectedApiKey: () => Promise<boolean>;
            openSelectKey: () => Promise<void>;
        };
    }
}
