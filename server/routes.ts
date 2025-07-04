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
      cb(new Error('Unsupported file type'), false);
    }
  },
});

// Estuary API configuration
const ESTUARY_API_URL = 'https://api.estuary.tech';
const ESTUARY_TOKEN = process.env.ESTUARY_TOKEN || process.env.ESTUARY_API_KEY || '';

async function uploadToEstuary(fileBuffer: Buffer, filename: string): Promise<{
  cid: string;
  dealId?: string;
  filcdnUrl: string;
}> {
  const formData = new FormData();
  const blob = new Blob([fileBuffer]);
  formData.append('data', blob, filename);

  const response = await fetch(`${ESTUARY_API_URL}/content/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ESTUARY_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Estuary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  const cid = data.cid || data.Hash;
  const dealId = data.dealId || data.deal_id;
  
  return {
    cid,
    dealId,
    filcdnUrl: `https://gateway.filcdn.io/ipfs/${cid}`,
  };
}

async function checkDealStatus(cid: string): Promise<DealStatus> {
  const response = await fetch(`${ESTUARY_API_URL}/content/status/${cid}`, {
    headers: {
      'Authorization': `Bearer ${ESTUARY_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to check deal status: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    dealId: data.dealId || data.deal_id || '',
    cid,
    status: data.status || 'pending',
    pdpVerified: data.pdpVerified || data.pdp_verified || false,
    lastVerified: data.lastVerified || data.last_verified,
  };
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

      // Upload to Estuary
      const estuaryResult = await uploadToEstuary(req.file.buffer, req.file.originalname);
      
      // Create file record
      const fileData = {
        filename: req.file.originalname,
        originalName: req.file.originalname,
        cid: estuaryResult.cid,
        dealId: estuaryResult.dealId,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        walletAddress,
        pdpEnabled: true,
        filcdnEnabled: true,
        status: 'active',
        pdpVerified: false,
        filcdnUrl: estuaryResult.filcdnUrl,
      };

      const file = await storage.createFile(fileData);
      
      // Create deal record if dealId exists
      if (estuaryResult.dealId) {
        await storage.createDeal({
          fileId: file.id,
          dealId: estuaryResult.dealId,
          cid: estuaryResult.cid,
          status: 'active',
          pdpVerified: false,
        });
      }

      const response: UploadResponse = {
        fileId: file.id,
        cid: estuaryResult.cid,
        dealId: estuaryResult.dealId,
        filcdnUrl: estuaryResult.filcdnUrl,
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
