// In-memory storage для прокси-ссылок
// В продакшене лучше использовать Redis или базу данных

class ProxyStorage {
  constructor() {
    this.links = new Map();
  }

  // Генерация короткого ID
  generateId() {
    return Math.random().toString(36).substring(2, 8);
  }

  // Создание новой прокси-ссылки
  createLink(originalUrl) {
    const id = this.generateId();

    // Проверяем, не существует ли уже такая ссылка
    if (this.links.has(id)) {
      return this.createLink(originalUrl); // Генерируем новый ID
    }

    this.links.set(id, {
      originalUrl,
      createdAt: new Date().toISOString(),
      visits: 0
    });

    return id;
  }

  // Получение оригинального URL по ID
  getLink(id) {
    return this.links.get(id);
  }

  // Увеличение счетчика посещений
  incrementVisits(id) {
    const link = this.links.get(id);
    if (link) {
      link.visits++;
    }
  }

  // Получение всех ссылок (для отладки)
  getAllLinks() {
    return Array.from(this.links.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }
}

// Singleton instance
let storage = null;

export function getStorage() {
  if (!storage) {
    storage = new ProxyStorage();
  }
  return storage;
}