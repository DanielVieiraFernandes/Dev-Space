import { DevelopersRepository } from "@/domain/dev-space/application/repositories/developers-repository";
import { Developer } from "@/domain/dev-space/enterprise/entities/developer";

export class InMemoryDevelopersRepository implements DevelopersRepository {
  items: Developer[] = [];

  async create(developer: Developer): Promise<void> {
    this.items.push(developer);
  }

  async save(developer: Developer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === developer.id);

    if (itemIndex > -1) {
      this.items[itemIndex] = developer;
    }
  }

  async remove(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === id);

    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1);
    }
  }

  async findById(id: string): Promise<Developer | null> {
    const developer = this.items.find((item) => item.id === id);

    if (!developer) {
      return null;
    }

    return developer;
  }

  async findByEmail(email: string): Promise<Developer | null> {
    const developer = this.items.find((item) => item.email === email);

    if (!developer) {
      return null;
    }

    return developer;
  }
}
