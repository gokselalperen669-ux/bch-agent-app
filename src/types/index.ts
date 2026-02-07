export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    token?: string;
}

export interface Agent {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    userId: string;
    agentId?: string;
    ticker?: string;
    supply?: string;
    category?: string;
    status?: 'active' | 'inactive' | 'online';
}

export interface Wallet {
    id: string;
    name: string;
    address: string;
    userId: string;
    createdAt: string;
    balance?: string;
    agentId?: string;
}
