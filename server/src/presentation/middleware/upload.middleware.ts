import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { sendBadRequestResponse } from 'src/shared/utils/presentation/controller.utils';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadSingle = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendBadRequestResponse(res, 'File too large. Maximum size is 10MB.');
        }
        return sendBadRequestResponse(res, err.message);
      } else if (err) {
        return sendBadRequestResponse(res, err.message);
      }
      next();
    });
  };
};

