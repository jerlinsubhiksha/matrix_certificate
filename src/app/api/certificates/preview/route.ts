import { NextResponse } from 'next/server';
import { generateCertificatePdf } from '@/lib/pdf';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    
    const templateFile = data.get('template') as File;
    const fieldsStr = data.get('fields') as string;
    const participantStr = data.get('participantData') as string;

    if (!templateFile || !fieldsStr || !participantStr) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const fields = JSON.parse(fieldsStr);
    const participantData = JSON.parse(participantStr);

    // Read the template file buffer
    const templateBuffer = await templateFile.arrayBuffer();

    // In a real implementation, you would load the actual TTF fonts here
    // const fontBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'Inter-SemiBold.ttf'));
    // For this prototype, we'll assume pdf-lib uses built-in StandardFonts if custom fonts aren't provided
    // BUT pdf-lib StandardFonts do not support custom .ttf embedding directly without the buffer.
    // Since we don't have the font files downloaded in the repo yet, we'll pass an empty font record, 
    // and pdf.ts will need to handle it or we'll inject a standard font.
    // Wait, pdf.ts expects a Buffer. Let's assume the frontend sends standard font names and we map them to StandardFonts.
    // For now, let's just pass empty and let the fallback handle it.
    
    // In actual code, we must fetch the font buffer:
    // const fonts = { 'Playfair Display': fs.readFileSync(...) }
    
    const pdfBytes = await generateCertificatePdf(templateBuffer, participantData, fields, {});

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="preview.pdf"'
      },
    });

  } catch (error: any) {
    console.error("Preview generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
