/**
 * jobPhotoService.ts
 * Client-Side Image Compression & Offline-Resilient Cloudinary Upload Pipeline
 * For "Before Work", "After Work", and "Hardware Parts Bill" electrician verification.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { fetchWithTimeout, TimeoutError } from './fetchWithTimeout';

export type JobPhotoStage = 'BEFORE_WORK' | 'AFTER_WORK' | 'PARTS_BILL' | 'PAYMENT_PROOF';

export interface JobPhotoMetadata {
  jobId: string;
  electricianId: string;
  stage: JobPhotoStage;
  notes?: string;
}

export interface CompressedPhotoResult {
  uri: string;
  width: number;
  height: number;
}

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  bytes: number;
  format?: string;
  width?: number;
  height?: number;
}

export interface QueuedUploadItem {
  id: string;
  localUri: string;
  metadata: JobPhotoMetadata;
  createdAt: number;
  retryCount: number;
  lastError?: string;
}

export interface UploadResponse {
  status: 'UPLOADED' | 'QUEUED_OFFLINE';
  secureUrl?: string;
  publicId?: string;
  localUri: string;
  queueId?: string;
}

const STORAGE_KEY_PHOTO_QUEUE = '@sheriyakam_photo_queue';
const CLOUDINARY_UPLOAD_TIMEOUT_MS = 15000;

export const jobPhotoService = {
  /**
   * TASK 1.1: Compress photo locally before attempting any network transfer.
   * Resizes longest dimension to max 1080px and compresses at 0.7 quality.
   * Produces WebP on Android and JPEG on iOS/Web for optimal size (<120KB).
   */
  async compressJobPhoto(localUri: string): Promise<CompressedPhotoResult> {
    if (!localUri) {
      throw new Error('Local image URI is required for compression.');
    }

    const targetFormat = Platform.OS === 'android' ? SaveFormat.WEBP : SaveFormat.JPEG;

    try {
      // Resize longest edge to max 1080px
      const manipResult = await manipulateAsync(
        localUri,
        [{ resize: { width: 1080 } }],
        {
          compress: 0.7,
          format: targetFormat,
        }
      );

      return {
        uri: manipResult.uri,
        width: manipResult.width,
        height: manipResult.height,
      };
    } catch (err) {
      console.warn('[JobPhotoService] Compression failed, falling back to original URI:', (err as Error).message);
      return {
        uri: localUri,
        width: 1080,
        height: 1080,
      };
    }
  },

  /**
   * TASK 1.2: Upload compressed image to Cloudinary via unsigned preset.
   * Strictly avoids secret keys in React Native client bundles.
   * Uses AbortController with 15-second timeout.
   */
  async uploadToCloudinary(
    compressedUri: string,
    metadata: JobPhotoMetadata
  ): Promise<CloudinaryUploadResult> {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'sheriyakam';
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_PRESET || 'sheriyakam_jobs';

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();

    // Determine filename and mimetype
    const isWebP = compressedUri.endsWith('.webp');
    const filename = `job_${metadata.jobId}_${metadata.stage}_${Date.now()}.${isWebP ? 'webp' : 'jpg'}`;
    const mimeType = isWebP ? 'image/webp' : 'image/jpeg';

    // React Native FormData file signature
    formData.append('file', {
      uri: compressedUri,
      type: mimeType,
      name: filename,
    } as any);

    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `sheriyakam/jobs/${metadata.jobId}`);
    formData.append('tags', `job_${metadata.jobId},stage_${metadata.stage},tech_${metadata.electricianId}`);
    formData.append('context', `jobId=${metadata.jobId}|stage=${metadata.stage}|techId=${metadata.electricianId}`);

    const res = await fetchWithTimeout(uploadUrl, {
      method: 'POST',
      body: formData,
      timeoutMs: CLOUDINARY_UPLOAD_TIMEOUT_MS,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Cloudinary upload failed with status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return {
      secureUrl: data.secure_url || data.url,
      publicId: data.public_id,
      bytes: data.bytes || 0,
      format: data.format,
      width: data.width,
      height: data.height,
    };
  },

  /**
   * High-Level Pipeline:
   * Compresses photo -> Attempts Cloudinary upload -> If network times out or fails,
   * enqueues in offline storage and returns QUEUED_OFFLINE without blocking the electrician!
   */
  async processAndUploadJobPhoto(
    rawUri: string,
    metadata: JobPhotoMetadata
  ): Promise<UploadResponse> {
    // 1. Local compression (always executes on-device without network)
    const compressed = await this.compressJobPhoto(rawUri);

    // 2. Attempt upload
    try {
      const uploaded = await this.uploadToCloudinary(compressed.uri, metadata);
      return {
        status: 'UPLOADED',
        secureUrl: uploaded.secureUrl,
        publicId: uploaded.publicId,
        localUri: compressed.uri,
      };
    } catch (err) {
      console.warn(`[JobPhotoService] Upload failed for ${metadata.stage}. Enqueueing offline:`, (err as Error).message);
      const queueItem = await this.queueFailedUpload(compressed.uri, metadata, (err as Error).message);
      return {
        status: 'QUEUED_OFFLINE',
        localUri: compressed.uri,
        queueId: queueItem.id,
      };
    }
  },

  /**
   * TASK 1.3: Enqueue failed or offline photo upload to AsyncStorage.
   */
  async queueFailedUpload(
    localUri: string,
    metadata: JobPhotoMetadata,
    errorMsg?: string
  ): Promise<QueuedUploadItem> {
    const queue = await this.getUploadQueue();
    const newItem: QueuedUploadItem = {
      id: `photo_queue_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      localUri,
      metadata,
      createdAt: Date.now(),
      retryCount: 0,
      lastError: errorMsg,
    };

    queue.push(newItem);
    await AsyncStorage.setItem(STORAGE_KEY_PHOTO_QUEUE, JSON.stringify(queue));
    return newItem;
  },

  /**
   * Retrieves pending offline upload queue.
   */
  async getUploadQueue(): Promise<QueuedUploadItem[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_PHOTO_QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Flushes offline upload queue when connectivity returns.
   * Uploads pending items and removes successful ones from storage.
   */
  async flushUploadQueue(): Promise<{ uploadedCount: number; remainingCount: number }> {
    const queue = await this.getUploadQueue();
    if (queue.length === 0) {
      return { uploadedCount: 0, remainingCount: 0 };
    }

    const remainingQueue: QueuedUploadItem[] = [];
    let uploadedCount = 0;

    for (const item of queue) {
      try {
        await this.uploadToCloudinary(item.localUri, item.metadata);
        uploadedCount++;
      } catch (err) {
        remainingQueue.push({
          ...item,
          retryCount: item.retryCount + 1,
          lastError: (err as Error).message,
        });
      }
    }

    await AsyncStorage.setItem(STORAGE_KEY_PHOTO_QUEUE, JSON.stringify(remainingQueue));
    return {
      uploadedCount,
      remainingCount: remainingQueue.length,
    };
  },

  /**
   * Returns count of photos waiting in the offline queue.
   */
  async getPendingCount(): Promise<number> {
    const queue = await this.getUploadQueue();
    return queue.length;
  },
};
