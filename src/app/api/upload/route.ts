import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

// Configure for static export
export const dynamic = 'force-static';
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Save to public/images/media directory
    const path = join(process.cwd(), 'public', 'images', 'media', filename);
    await writeFile(path, buffer);

    // Return the public URL
    const publicUrl = `/images/media/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename,
      originalName: file.name
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ success: false, error: 'No filename provided' });
    }

    // Delete file from public/images/media directory
    const path = join(process.cwd(), 'public', 'images', 'media', filename);
    await unlink(path);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ success: false, error: 'Delete failed' });
  }
}
