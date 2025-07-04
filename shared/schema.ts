import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  cid: text("cid").notNull(),
  dealId: text("deal_id"),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  walletAddress: text("wallet_address").notNull(),
  pdpEnabled: boolean("pdp_enabled").default(true),
  filcdnEnabled: boolean("filcdn_enabled").default(true),
  status: text("status").notNull().default("uploading"), // uploading, active, sealing, failed
  pdpVerified: boolean("pdp_verified").default(false),
  lastVerified: timestamp("last_verified"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  filcdnUrl: text("filcdn_url"),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").references(() => files.id),
  dealId: text("deal_id").notNull(),
  cid: text("cid").notNull(),
  status: text("status").notNull(), // pending, active, sealing, failed
  pdpVerified: boolean("pdp_verified").default(false),
  lastVerified: timestamp("last_verified"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  uploadedAt: true,
  lastVerified: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  lastVerified: true,
});

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

// API response types
export interface UploadResponse {
  fileId: number;
  cid: string;
  dealId?: string;
  filcdnUrl: string;
  status: string;
}

export interface DealStatus {
  dealId: string;
  cid: string;
  status: string;
  pdpVerified: boolean;
  lastVerified?: string;
}

export interface FileWithDeal extends File {
  deal?: Deal;
}
