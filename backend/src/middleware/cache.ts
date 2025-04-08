import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { config } from '../config';

const redis = new Redis(config.redisUrl);

export const cache = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(body) {
        redis.setex(key, duration, JSON.stringify(body));
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

export const clearCache = async (pattern: string) => {
  const keys = await redis.keys(`cache:${pattern}`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}; 