import { PaginationCursor } from 'src/domain/interfaces/repositories/ats/IATSActivityRepository';

export class CursorUtil {
  static parseCursor(cursorString: string): PaginationCursor | undefined {
    const [createdAtStr, id] = cursorString.split('_');

    if (!createdAtStr || !id) {
      return undefined;
    }

    const timestamp = parseInt(createdAtStr, 10);
    if (isNaN(timestamp)) {
      return undefined;
    }

    return {
      createdAt: new Date(timestamp),
      _id: id,
    };
  }

  static serializeCursor(cursor: PaginationCursor): string {
    return `${cursor.createdAt.getTime()}_${cursor._id}`;
  }
}
