import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import { CompanySubscriptionModel } from '../database/mongodb/models/company-subcription.model';
import { JobPostingModel } from '../database/mongodb/models/job-posting.model';
import { connectToDatabase } from '../database/mongodb/connection/mongoose';
import { env } from '../config/env';

async function migrate() {
  try {
    const mongoUri = env.MONGO_URI || process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI not set');

    await connectToDatabase(mongoUri);
    console.log('Connected to MongoDB');

    const activeSubs = await CompanySubscriptionModel.find({
      isActive: true,
      expiryDate: { $gt: new Date() },
    }).select('_id companyId');

    let updatedCount = 0;
    for (const sub of activeSubs) {
      const companyId = sub.companyId as unknown as Types.ObjectId;

      const [jobPostsUsed, featuredJobsUsed] = await Promise.all([
        JobPostingModel.countDocuments({ company_id: companyId, status: 'active' }),
        JobPostingModel.countDocuments({ company_id: companyId, status: 'active', is_featured: true }),
      ]);

      await CompanySubscriptionModel.updateOne(
        { _id: sub._id },
        { $set: { jobPostsUsed, featuredJobsUsed } },
      );
      updatedCount++;
    }

    console.log(`Updated ${updatedCount} active subscriptions with usage counts.`);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

// Run when executed directly
if (require.main === module) {
  migrate();
}

export default migrate;
