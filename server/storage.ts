import { files, deals, type File, type Deal, type InsertFile, type InsertDeal, type FileWithDeal } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await this.db
      .insert(files)
      .values(insertFile)
      .returning();
    return file;
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await this.db
      .select()
      .from(files)
      .where(eq(files.id, id))
      .limit(1);
    return file;
  }

  async getFilesByCid(cid: string): Promise<File[]> {
    return await this.db
      .select()
      .from(files)
      .where(eq(files.cid, cid));
  }

  async getFilesByWallet(walletAddress: string): Promise<FileWithDeal[]> {
    const userFiles = await this.db
      .select()
      .from(files)
      .where(eq(files.walletAddress, walletAddress))
      .orderBy(desc(files.uploadedAt));

    // Get deals for each file
    const filesWithDeals: FileWithDeal[] = [];
    for (const file of userFiles) {
      const [deal] = await this.db
        .select()
        .from(deals)
        .where(eq(deals.cid, file.cid))
        .limit(1);
      
      filesWithDeals.push({ ...file, deal });
    }

    return filesWithDeals;
  }

  async updateFileStatus(id: number, status: string, pdpVerified?: boolean): Promise<void> {
    const updateData: any = { status };
    if (pdpVerified !== undefined) {
      updateData.pdpVerified = pdpVerified;
    }

    await this.db
      .update(files)
      .set(updateData)
      .where(eq(files.id, id));
  }

  async updateFileVerification(id: number, pdpVerified: boolean, lastVerified: Date): Promise<void> {
    await this.db
      .update(files)
      .set({ pdpVerified, lastVerified })
      .where(eq(files.id, id));
  }

  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const [deal] = await this.db
      .insert(deals)
      .values(insertDeal)
      .returning();
    return deal;
  }

  async getDeal(dealId: string): Promise<Deal | undefined> {
    const [deal] = await this.db
      .select()
      .from(deals)
      .where(eq(deals.dealId, dealId))
      .limit(1);
    return deal;
  }

  async getDealByCid(cid: string): Promise<Deal | undefined> {
    const [deal] = await this.db
      .select()
      .from(deals)
      .where(eq(deals.cid, cid))
      .limit(1);
    return deal;
  }

  async updateDealStatus(dealId: string, status: string, pdpVerified?: boolean): Promise<void> {
    const updateData: any = { status };
    if (pdpVerified !== undefined) {
      updateData.pdpVerified = pdpVerified;
    }

    await this.db
      .update(deals)
      .set(updateData)
      .where(eq(deals.dealId, dealId));
  }

  async updateDealVerification(dealId: string, pdpVerified: boolean, lastVerified: Date): Promise<void> {
    await this.db
      .update(deals)
      .set({ pdpVerified, lastVerified })
      .where(eq(deals.dealId, dealId));
  }

  async getFileStats(walletAddress: string): Promise<{
    totalFiles: number;
    activeDeals: number;
    totalStorage: number;
    cdnRequests: number;
  }> {
    const userFiles = await this.db
      .select()
      .from(files)
      .where(eq(files.walletAddress, walletAddress));
    
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

// Use DatabaseStorage if DATABASE_URL is available, otherwise fallback to MemStorage
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();