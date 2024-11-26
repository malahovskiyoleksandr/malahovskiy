import { NextResponse } from 'next/server';
import { getGridFSBucket } from '../../../../lib/mongodb';

export const GET = async (req, { params }) => {
  const { id } = params;
  const bucket = await getGridFSBucket();

  try {
    const file = await bucket.find({ _id: id }).toArray();
    if (file.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'File not found' }), { status: 404 });
    }

    const readStream = bucket.openDownloadStream(id);

    return new NextResponse(readStream, {
      headers: { 'Content-Type': file[0].contentType },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: 'Error retrieving file' }), { status: 500 });
  }
};
