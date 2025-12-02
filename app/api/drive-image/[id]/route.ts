import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json(
      { error: 'Invalid image ID' },
      { status: 400 }
    );
  }

  try {
    // Try lh3.googleusercontent first (most reliable)
    const driveUrl = `https://lh3.googleusercontent.com/d/${id}`;

    const response = await fetch(driveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KibiApp/1.0)',
      },
    });

    if (!response.ok) {
      // Fallback to thumbnail endpoint
      const thumbnailUrl = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      const fallbackResponse = await fetch(thumbnailUrl);

      if (!fallbackResponse.ok) {
        return NextResponse.json(
          { error: 'Image not found or not accessible' },
          { status: 404 }
        );
      }

      const buffer = await fallbackResponse.arrayBuffer();
      const contentType = fallbackResponse.headers.get('Content-Type') || 'image/jpeg';

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=604800',
          'CDN-Cache-Control': 'public, max-age=604800',
        },
      });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'CDN-Cache-Control': 'public, max-age=604800',
      },
    });
  } catch (error) {
    console.error('Error fetching Drive image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
