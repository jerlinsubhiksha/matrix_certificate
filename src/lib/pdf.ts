import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { CertificateField } from './store';

export async function generateCertificatePdf(
  templateBytes: ArrayBuffer,
  participantData: Record<string, string>,
  fields: CertificateField[],
  fonts: Record<string, ArrayBuffer>
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  const fallbackFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const embeddedFonts: Record<string, any> = {};
  for (const [fontName, fontBytes] of Object.entries(fonts)) {
    embeddedFonts[fontName] = await pdfDoc.embedFont(fontBytes);
  }

  const pages = pdfDoc.getPages();
  const page = pages[0]; // Assuming single-page certificates
  const { height } = page.getSize();

  // Helper to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? rgb(
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255
        )
      : rgb(0, 0, 0); // fallback black
  };

  for (const field of fields) {
    const text = participantData[field.field];
    if (!text) continue;

    const font = embeddedFonts[field.font] || fallbackFont;

    const textWidth = font.widthOfTextAtSize(text, field.fontSize);
    
    // X Coordinate Adjustment based on alignment
    let drawX = field.x;
    if (field.alignment === 'center') {
      drawX = field.x - textWidth / 2;
    } else if (field.alignment === 'right') {
      drawX = field.x - textWidth;
    }

    // Y Coordinate: pdf-lib (0,0) is bottom-left. Assuming frontend uses top-left.
    // If frontend uses top-left, we must invert: height - field.y
    const drawY = height - field.y;

    page.drawText(text, {
      x: drawX,
      y: drawY,
      size: field.fontSize,
      font: font,
      color: hexToRgb(field.color),
    });
  }

  return await pdfDoc.save();
}
