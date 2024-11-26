import multer from 'multer';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import multerGridFsStorage from 'multer-gridfs-storage';
import { Readable } from 'stream';

// Настройка хранилища для multer
const storage = multerGridFsStorage({
  url: "mongodb+srv://maksimkryglyk:Prometey888!@meseges.v08jrmf.mongodb.net/?retryWrites=true&w=majority&appName=meseges",
  file: (req, file) => {
    return { bucketName: 'images', filename: file.originalname };
  },
});

const upload = multer({ storage });

export const POST = async (req) => {
  return new Promise((resolve, reject) => {
    upload.single('file')(req, {}, (err) => {
      if (err) {
        reject(new NextResponse(JSON.stringify({ error: 'File upload failed' }), { status: 500 }));
      } else {
        resolve(new NextResponse(JSON.stringify({ message: 'File uploaded successfully' }), { status: 200 }));
      }
    });
  });
};
