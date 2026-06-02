'use client';

let ocrInstance: any = null;
let ocrInitializing: Promise<any> | null = null;

export function dataURLtoBlob(dataurl: string): Blob | null {
  try {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error("Failed to convert dataURL to Blob", e);
    return null;
  }
}

export function extractPriceFromText(text: string): string | null {
  const decimalMatches = text.match(/\b\d+[\.,]\d{2}\b/);
  if (decimalMatches) {
    return decimalMatches[0].replace(/,/g, "");
  }
  
  const matches = text.match(/[\d,]+\.?\d*/);
  if (matches) {
    const clean = matches[0].replace(/,/g, "");
    if (!isNaN(parseFloat(clean))) {
      return clean;
    }
  }
  return null;
}

export async function getOcrInstance() {
  if (ocrInstance) return ocrInstance;
  if (ocrInitializing) return ocrInitializing;
  
  ocrInitializing = (async () => {
    try {
      // @ts-ignore
      const { PaddleOCR } = await import("@paddleocr/paddleocr-js");
      const instance = await PaddleOCR.create({
        lang: "en",
        ocrVersion: "PP-OCRv5",
        worker: true,
        ortOptions: {
          backend: "wasm",
          wasmPaths: "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/",
          numThreads: 2,
          simd: true
        }
      });
      ocrInstance = instance;
      return instance;
    } catch (e) {
      console.error("Failed to initialize PaddleOCR:", e);
      ocrInitializing = null;
      throw e;
    }
  })();
  
  return ocrInitializing;
}
