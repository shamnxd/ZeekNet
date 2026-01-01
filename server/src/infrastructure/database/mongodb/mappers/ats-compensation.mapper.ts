import { Types } from 'mongoose';
import { ATSCompensation } from '../../../../domain/entities/ats-compensation.entity';
import { IATSCompensationDocument } from '../models/ats-compensation.model';

export class ATSCompensationMapper {
  static toEntity(doc: IATSCompensationDocument): ATSCompensation {
    return new ATSCompensation(
      (doc._id as Types.ObjectId).toString(),
      doc.applicationId.toString(),
      doc.candidateExpected,
      doc.companyProposed,
      doc.finalAgreed,
      doc.expectedJoining,
      doc.benefits || [],
      doc.approvedAt,
      doc.approvedBy?.toString(),
      doc.approvedByName,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(compensation: ATSCompensation): Partial<IATSCompensationDocument> {
    return {
      applicationId: new Types.ObjectId(compensation.applicationId),
      candidateExpected: compensation.candidateExpected,
      companyProposed: compensation.companyProposed,
      finalAgreed: compensation.finalAgreed,
      expectedJoining: compensation.expectedJoining,
      benefits: compensation.benefits,
      approvedAt: compensation.approvedAt,
      approvedBy: compensation.approvedBy ? new Types.ObjectId(compensation.approvedBy) : undefined,
      approvedByName: compensation.approvedByName,
    };
  }
}

