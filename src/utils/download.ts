import { jsPDF } from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';

// ============================================
// Helper: Trigger Download
// ============================================
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================
// Helper: Get SVG Dimensions
// ============================================
function getSvgDimensions(svg: SVGSVGElement): { width: number; height: number } {
  const viewBox = svg.viewBox.baseVal;
  let width = viewBox.width;
  let height = viewBox.height;

  if (!width || !height) {
    const bbox = svg.getBBox();
    width = bbox.width || 100;
    height = bbox.height || 100;
  }

  return { width, height };
}

// ============================================
// SVG Download (Vector)
// ============================================
export function downloadSvg(svg: SVGSVGElement, filename: string = 'formula.svg'): void {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  triggerDownload(blob, filename);
}

// ============================================
// PDF Download (Vector)
// ============================================
export async function downloadPdfVector(
  svg: SVGSVGElement,
  filename: string = 'formula.pdf'
): Promise<void> {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const { width, height } = getSvgDimensions(svg);

  const padding = 20;
  const pdfWidth = width + padding * 2;
  const pdfHeight = height + padding * 2;

  const pdf = new jsPDF({
    orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [pdfWidth, pdfHeight],
  });

  await svg2pdf(clonedSvg, pdf, {
    x: padding,
    y: padding,
    width,
    height,
  });

  pdf.save(filename);
}

// ============================================
// Raster Download (PNG/JPG)
// ============================================
interface RasterOptions {
  scale: number;
  format: 'png' | 'jpeg';
  quality?: number;
  backgroundColor?: string;
}

async function downloadRaster(
  svg: SVGSVGElement,
  filename: string,
  options: RasterOptions
): Promise<void> {
  const { scale, format, quality = 0.95, backgroundColor } = options;

  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const { width, height } = getSvgDimensions(svg);

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d')!;

  if (backgroundColor || format === 'jpeg') {
    ctx.fillStyle = backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(svgUrl);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error('Failed to load SVG for rasterization'));
    };
    img.src = svgUrl;
  });

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          triggerDownload(blob, filename);
          resolve();
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

// PNG exports
export function downloadPngHighres(svg: SVGSVGElement, filename: string = 'formula.png'): Promise<void> {
  return downloadRaster(svg, filename, { format: 'png', scale: 3 });
}

export function downloadPngLowres(svg: SVGSVGElement, filename: string = 'formula.png'): Promise<void> {
  return downloadRaster(svg, filename, { format: 'png', scale: 1 });
}

// JPG exports
export function downloadJpgHighres(svg: SVGSVGElement, filename: string = 'formula.jpg'): Promise<void> {
  return downloadRaster(svg, filename, { format: 'jpeg', scale: 3, backgroundColor: '#ffffff' });
}

export function downloadJpgLowres(svg: SVGSVGElement, filename: string = 'formula.jpg'): Promise<void> {
  return downloadRaster(svg, filename, { format: 'jpeg', scale: 1, backgroundColor: '#ffffff' });
}
