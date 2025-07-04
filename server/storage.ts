import { files, deals, type File, type Deal, type InsertFile, type InsertDeal, type FileWithDeal } from "@shared/schema";

export interface IStorage {
  // File operations
  createFile(file: InsertFile): Promise<File>;
  getFile(id: number): Promise<File | undefined>;
  getFilesByCid(cid: string): Promise<File[]>;
  getFilesByWallet(walletAddress: string): Promise<FileWithDeal[]>;
  updateFileStatus(id: number, status: string, pdpVerified?: boolean): Promise<void>;
  updateFileVerification(id: number, pdpVerified: boolean, lastVerified: Date): Promise<void>;
  
  // Deal operations
  createDeal(deal: InsertDeal): Promise<Deal>;
  getDeal(dealId: string): Promise<Deal | undefined>;
  getDealByCid(cid: string): Promise<Deal | undefined>;
  updateDealStatus(dealId: string, status: string, pdpVerified?: boolean): Promise<void>;
  updateDealVerification(dealId: string, pdpVerified: boolean, lastVerified: Date): Promise<void>;
  
  // Stats
  getFileStats(walletAddress: string): Promise<{
    totalFiles: number;
    activeDeals: number;
    totalStorage: number;
    cdnRequests: number;
  }>;
}

export class MemStorage implements IStorage {
  private files: Map<number, File>;
  private deals: Map<string, Deal>;
  private currentFileId: number;
  private currentDealId: number;

  constructor() {
    this.files = new Map();
    this.deals = new Map();
    this.currentFileId = 1;
    this.currentDealId = 1;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.currentFileId++;
    const file: File = {
      ...insertFile,
      id,
      dealId: insertFile.dealId ?? null,
      pdpEnabled: insertFile.pdpEnabled ?? null,
      filcdnEnabled: insertFile.filcdnEnabled ?? null,
      pdpVerified: insertFile.pdpVerified ?? null,
      filcdnUrl: insertFile.filcdnUrl ?? null,
      status: insertFile.status || 'uploading',
      uploadedAt: new Date(),
      lastVerified: null,
    };
    this.files.set(id, file);
    return file;
  }

  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFilesByCid(cid: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(file => file.cid === cid);
  }

  async getFilesByWallet(walletAddress: string): Promise<FileWithDeal[]> {
    const userFiles = Array.from(this.files.values())
      .filter(file => file.walletAddress === walletAddress)
      .sort((a, b) => (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0));
    
    return userFiles.map(file => {
      const deal = Array.from(this.deals.values()).find(d => d.cid === file.cid);
      return { ...file, deal };
    });
  }

  async updateFileStatus(id: number, status: string, pdpVerified?: boolean): Promise<void> {
    const file = this.files.get(id);
    if (file) {
      const updatedFile = { ...file, status };
      if (pdpVerified !== undefined) {
        updatedFile.pdpVerified = pdpVerified;
      }
      this.files.set(id, updatedFile);
    }
  }

  async updateFileVerification(id: number, pdpVerified: boolean, lastVerified: Date): Promise<void> {
    const file = this.files.get(id);
    if (file) {
      this.files.set(id, { ...file, pdpVerified, lastVerified });
    }
  }

  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const id = this.currentDealId++;
    const deal: Deal = {
      ...insertDeal,
      id,
      fileId: insertDeal.fileId ?? null,
      pdpVerified: insertDeal.pdpVerified ?? null,
      createdAt: new Date(),
      lastVerified: null,
    };
    this.deals.set(insertDeal.dealId, deal);
    return deal;
  }

  async getDeal(dealId: string): Promise<Deal | undefined> {
    return this.deals.get(dealId);
  }

  async getDealByCid(cid: string): Promise<Deal | undefined> {
    return Array.from(this.deals.values()).find(deal => deal.cid === cid);
  }

  async updateDealStatus(dealId: string, status: string, pdpVerified?: boolean): Promise<void> {
    const deal = this.deals.get(dealId);
    if (deal) {
      const updatedDeal = { ...deal, status };
      if (pdpVerified !== undefined) {
        updatedDeal.pdpVerified = pdpVerified;
      }
      this.deals.set(dealId, updatedDeal);
    }
  }

  async updateDealVerification(dealId: string, pdpVerified: boolean, lastVerified: Date): Promise<void> {
    const deal = this.deals.get(dealId);
    if (deal) {
      this.deals.set(dealId, { ...deal, pdpVerified, lastVerified });
    }
  }

  async getFileStats(walletAddress: string): Promise<{
    totalFiles: number;
    activeDeals: number;
    totalStorage: number;
    cdnRequests: number;
  }> {
    const userFiles = Array.from(this.files.values())
      .filter(file => file.walletAddress === walletAddress);
    
    const activeDeals = userFiles.filter(file => file.status === 'active').length;
    const totalStorage = userFiles.reduce((sum, file) => sum + file.fileSize, 0);
    
    return {
      totalFiles: userFiles.length,
      activeDeals,
      totalStorage,
      cdnRequests: Math.floor(Math.random() * 5000) + 1000, // Mock CDN requests
    };
  }
}

export const storage = new MemStorage();
