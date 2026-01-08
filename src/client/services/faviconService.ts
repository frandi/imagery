import axios from 'axios';
import { FaviconConvertResponse, FaviconSize } from '../types/favicon.types';

const API_BASE_URL = '/api';

export const faviconService = {
  /**
   * Convert image to favicon
   * @param file Image file to convert
   * @param sizes Size option ('16', '32', or 'both')
   * @returns Conversion result with download URL
   */
  async convert(file: File, sizes: FaviconSize): Promise<FaviconConvertResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('sizes', sizes);

      const response = await axios.post<FaviconConvertResponse>(
        `${API_BASE_URL}/favicon/convert`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }

      return {
        success: false,
        error: {
          message: 'Failed to convert favicon. Please try again.',
          code: 'NETWORK_ERROR'
        }
      };
    }
  },

  /**
   * Get full download URL for a favicon file
   * @param filename Favicon filename
   * @returns Full download URL
   */
  getDownloadUrl(filename: string): string {
    return `${API_BASE_URL}/favicon/download/${filename}`;
  }
};
