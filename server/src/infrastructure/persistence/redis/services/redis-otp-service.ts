import { IOtpService } from 'src/domain/interfaces/services/IOtpService';
import { redisClient } from 'src/infrastructure/persistence/redis/connection/redis';
import { env } from 'src/infrastructure/config/env';

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export class RedisOtpService implements IOtpService {
  async generateOtp(email: string): Promise<string> {
    return this.generateAndStoreOtp(email);
  }

  async generateAndStoreOtp(identifier: string, ttlSeconds = Number(env.OTP_TTL_SECONDS) || 300): Promise<string> {
    const existingKey = `otp:${identifier}`;
    const existingOtp = await redisClient.get(existingKey);

    if (existingOtp) {
      const lastSentKey = `otp_last_sent:${identifier}`;
      const lastSent = await redisClient.get(lastSentKey);

      if (lastSent) {
        const timeDiff = Date.now() - parseInt(lastSent);
        if (timeDiff < 30000) {
          throw new Error('Please wait before requesting another OTP');
        }
      }
    }

    const code = generateCode();
    const key = `otp:${identifier}`;
    const lastSentKey = `otp_last_sent:${identifier}`;

    await Promise.all([redisClient.set(key, code, { EX: ttlSeconds }), redisClient.set(lastSentKey, Date.now().toString(), { EX: 60 })]);

    return code;
  }

  async verifyOtp(identifier: string, code: string): Promise<boolean> {
    const key = `otp:${identifier}`;
    const stored = await redisClient.get(key);
    if (!stored) return false;
    const ok = stored === code;
    if (ok) {
      await redisClient.del(key);
    }
    return ok;
  }
}
