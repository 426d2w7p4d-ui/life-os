import { uid } from './id';
import type { Attachment } from '../types/models';

const MAX_INLINE_SIZE = 2.5 * 1024 * 1024;

export async function filesToAttachments(files: FileList | File[]): Promise<Attachment[]> {
  const list = Array.from(files);
  return Promise.all(list.map(async file => ({
    id: uid(),
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    dataUrl: file.size <= MAX_INLINE_SIZE ? await fileToDataUrl(file) : undefined
  })));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('读取文件失败'));
    reader.readAsDataURL(file);
  });
}
