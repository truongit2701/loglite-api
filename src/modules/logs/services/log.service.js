import { Log } from '../models/log.model.js';

export class LogService {
  /**
   * Truy vấn Log tập trung
   */
  static async queryLogs(projectId, filters) {
    const { level, search, service, path, from, to, page = 1, limit = 50 } = filters;
    
    const query = { projectId };
    if (level) query.level = level;
    if (service) query.service = new RegExp(service, 'i');
    if (search) query.message = new RegExp(search, 'i');
    if (path) query['meta.url'] = new RegExp(path, 'i');
    
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = parseInt(from);
      if (to) query.timestamp.$lte = parseInt(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Log.countDocuments(query);

    return {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Lấy thống kê tập trung
   */
  static async getStats(projectId) {
    const [total, errors, services] = await Promise.all([
      Log.countDocuments({ projectId }),
      Log.countDocuments({ projectId, level: 'error' }),
      Log.distinct('service', { projectId })
    ]);

    return {
      total,
      errors,
      services: services.length
    };
  }
}
