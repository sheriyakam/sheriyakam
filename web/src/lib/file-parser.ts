/**
 * Server-side File Parsing Engine
 * Extracts text from PDF, DOCX, or raw text payloads
 */
export async function parseFileToText(
  bufferOrText: Buffer | string,
  mimeType?: string
): Promise<string> {
  if (typeof bufferOrText === 'string') {
    return bufferOrText.trim();
  }

  const buffer = bufferOrText;

  // Safe dynamic loader to prevent Next.js webpack from throwing build-time errors
  const safeRequire = (pkgName: string) => {
    try {
      return eval('require')(pkgName);
    } catch {
      return null;
    }
  };

  // 1. Check if DOCX (Office Open XML ZIP format starts with PK)
  if (
    mimeType?.includes('wordprocessingml') ||
    mimeType?.includes('docx') ||
    (buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4b)
  ) {
    try {
      const mammoth = safeRequire('mammoth');
      if (mammoth && mammoth.extractRawText) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value.trim();
      }
    } catch (e) {
      console.warn('[file-parser] Mammoth error, falling back to text stream extraction');
    }
  }

  // 2. Check if PDF (starts with %PDF)
  if (
    mimeType?.includes('pdf') ||
    (buffer.length > 4 && buffer.toString('utf-8', 0, 4) === '%PDF')
  ) {
    try {
      const pdfParse = safeRequire('pdf-parse');
      if (pdfParse) {
        const parseFn = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
        if (typeof parseFn === 'function') {
          const data = await parseFn(buffer);
          return data.text.trim();
        }
      }
    } catch (e) {
      console.warn('[file-parser] pdf-parse error, falling back to stream extraction');
    }
  }

  // 3. Robust fallback: Extract clean text characters from text buffer
  const rawStr = buffer.toString('utf-8');
  const cleaned = rawStr
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}
