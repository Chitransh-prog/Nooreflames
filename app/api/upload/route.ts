import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const originalName = file.name || 'product.jpg';
      const ext = path.extname(originalName) || '.jpg';
      const cleanBase = path
        .basename(originalName, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .toLowerCase();
      const filename = `${cleanBase}-${Date.now()}${ext}`;
      const targetPath = path.join(uploadsDir, filename);

      fs.writeFileSync(targetPath, buffer);

      return NextResponse.json({
        success: true,
        url: `/images/uploads/${filename}`,
      });
    } catch (diskErr: any) {
      // Serverless / Vercel read-only filesystem fallback: convert to base64 Data URL
      console.warn('Disk write failed on serverless platform, using Data URL fallback:', diskErr?.message);
      const mimeType = file.type || 'image/jpeg';
      const base64Data = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
      });
    }
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: err.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
