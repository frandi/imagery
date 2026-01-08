export type FaviconSize = '16' | '32' | 'both';

export interface FaviconConvertResponse {
  success: boolean;
  data?: {
    filename: string;
    downloadUrl: string;
    sizes: number[];
    fileSize: number;
    expiresAt: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface FaviconResult {
  filename: string;
  downloadUrl: string;
  sizes: number[];
  fileSize: number;
  expiresAt: string;
}
