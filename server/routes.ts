import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { insertFileSchema, insertDealSchema, type UploadResponse, type DealStatus } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/html',
      'text/css',
      'application/javascript',
      'application/json',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'model/gltf-binary',
      'model/gltf+json',
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.glb')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Web3.Storage configuration using w3up-client
import * as Client from '@web3-storage/w3up-client';

// Store the client instance (in production, use proper session management)
let web3StorageClient: any = null;

async function getWeb3StorageClient() {
  if (!web3StorageClient) {
    web3StorageClient = await Client.create();
    
    // For demo purposes, we'll use a mock space
    // In production, you'd handle proper email-based authentication
    try {
      // Create a space for uploads
      const space = await web3StorageClient.createSpace('fastlane-cdn');
      await web3StorageClient.setCurrentSpace(space.did());
    } catch (error) {
      console.log('Space already exists or client already configured');
    }
  }
  return web3StorageClient;
}

async function uploadToWeb3Storage(fileBuffer: Buffer, filename: string): Promise<{
  cid: string;
  dealId?: string;
  filcdnUrl: string;
}> {
  try {
    // For MVP demo purposes, we'll simulate the upload and generate a mock CID
    // In production, this would use proper Web3.Storage client with email auth
    console.log(`Simulating upload of ${filename} (${fileBuffer.length} bytes)`);
    
    // Generate a realistic looking CID for demo
    const mockCid = `bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi`;
    const filcdnUrl = `https://dweb.link/ipfs/${mockCid}`;
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      cid: mockCid,
      dealId: `w3s-${Date.now()}`,
      filcdnUrl,
    };
  } catch (error: any) {
    console.error('Web3.Storage upload error:', error);
    throw new Error(`Web3.Storage upload failed: ${error.message}`);
  }
}

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'glb': 'model/gltf-binary',
    'gltf': 'model/gltf+json',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

async function checkDealStatus(cid: string): Promise<DealStatus> {
  // Web3.Storage automatically handles Filecoin deals
  // For the MVP, we'll simulate deal status based on upload time
  try {
    // Check if the file is accessible via IPFS
    const response = await fetch(`https://dweb.link/ipfs/${cid}`, { method: 'HEAD' });
    const isAccessible = response.ok;
    
    return {
      dealId: `w3s-${cid.slice(0, 8)}`,
      cid,
      status: isAccessible ? 'active' : 'sealing',
      pdpVerified: isAccessible, // Simplified: if accessible, consider verified
      lastVerified: new Date().toISOString(),
    };
  } catch (error) {
    return {
      dealId: `w3s-${cid.slice(0, 8)}`,
      cid,
      status: 'sealing',
      pdpVerified: false,
      lastVerified: undefined,
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/upload - Upload file and create PDP deal
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const { walletAddress } = req.body;
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      // Upload to Web3.Storage
      const web3StorageResult = await uploadToWeb3Storage(req.file.buffer, req.file.originalname);
      
      // Create file record
      const fileData = {
        filename: req.file.originalname,
        originalName: req.file.originalname,
        cid: web3StorageResult.cid,
        dealId: web3StorageResult.dealId,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        walletAddress,
        pdpEnabled: true,
        filcdnEnabled: true,
        status: 'active',
        pdpVerified: false,
        filcdnUrl: web3StorageResult.filcdnUrl,
      };

      const file = await storage.createFile(fileData);
      
      // Create deal record if dealId exists
      if (web3StorageResult.dealId) {
        await storage.createDeal({
          fileId: file.id,
          dealId: web3StorageResult.dealId,
          cid: web3StorageResult.cid,
          status: 'active',
          pdpVerified: false,
        });
      }

      const response: UploadResponse = {
        fileId: file.id,
        cid: web3StorageResult.cid,
        dealId: web3StorageResult.dealId,
        filcdnUrl: web3StorageResult.filcdnUrl,
        status: file.status,
      };

      res.json(response);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // GET /api/deal/:cid - Check deal status
  app.get('/api/deal/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      
      // Check status from Estuary
      const dealStatus = await checkDealStatus(cid);
      
      // Update local records
      const deal = await storage.getDealByCid(cid);
      if (deal) {
        await storage.updateDealStatus(deal.dealId, dealStatus.status, dealStatus.pdpVerified);
        if (dealStatus.pdpVerified) {
          await storage.updateDealVerification(deal.dealId, true, new Date());
        }
      }

      res.json(dealStatus);
    } catch (error) {
      console.error('Deal status check error:', error);
      res.status(500).json({ error: 'Failed to check deal status' });
    }
  });

  // GET /api/files/:wallet - Get files for wallet
  app.get('/api/files/:wallet', async (req, res) => {
    try {
      const { wallet } = req.params;
      const files = await storage.getFilesByWallet(wallet);
      res.json(files);
    } catch (error) {
      console.error('Get files error:', error);
      res.status(500).json({ error: 'Failed to get files' });
    }
  });

  // GET /api/stats/:wallet - Get file statistics
  app.get('/api/stats/:wallet', async (req, res) => {
    try {
      const { wallet } = req.params;
      const stats = await storage.getFileStats(wallet);
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  });

  // POST /api/verify/:cid - Manually verify PDP proof
  app.post('/api/verify/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      
      const dealStatus = await checkDealStatus(cid);
      
      // Update verification status
      const deal = await storage.getDealByCid(cid);
      if (deal) {
        await storage.updateDealVerification(deal.dealId, dealStatus.pdpVerified, new Date());
      }

      res.json({ verified: dealStatus.pdpVerified });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ error: 'Failed to verify PDP proof' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
