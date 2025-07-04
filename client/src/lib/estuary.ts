export interface EstuaryUploadResult {
  cid: string;
  dealId?: string;
  filcdnUrl: string;
}

export interface EstuaryDealStatus {
  dealId: string;
  cid: string;
  status: string;
  pdpVerified: boolean;
  lastVerified?: string;
}

export async function uploadFile(file: File, walletAddress: string): Promise<EstuaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('walletAddress', walletAddress);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return await response.json();
}

export async function checkDealStatus(cid: string): Promise<EstuaryDealStatus> {
  const response = await fetch(`/api/deal/${cid}`);
  
  if (!response.ok) {
    throw new Error('Failed to check deal status');
  }

  return await response.json();
}

export async function verifyPdpProof(cid: string): Promise<{ verified: boolean }> {
  const response = await fetch(`/api/verify/${cid}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to verify PDP proof');
  }

  return await response.json();
}
