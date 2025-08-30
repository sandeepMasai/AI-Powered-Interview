import NodeCache from 'node-cache';

class EvaluationCache {
  constructor() {
    this.cache = new NodeCache({ 
      stdTTL: 3600,
      checkperiod: 600 
    });
  }

  async get(key) {
    return this.cache.get(key);
  }

  async set(key, value) {
    return this.cache.set(key, value);
  }

  async del(key) {
    return this.cache.del(key);
  }

  async flush() {
    this.cache.flushAll();
  }
}

export default EvaluationCache;