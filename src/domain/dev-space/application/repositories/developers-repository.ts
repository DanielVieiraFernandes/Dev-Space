import { Developer } from "@/domain/dev-space/enterprise/entities/developer";

export abstract class DevelopersRepository {
  abstract create(developer: Developer): Promise<void>;
  abstract save(developer: Developer): Promise<void>;
  abstract remove(id: string): Promise<void>;
  abstract findById(id: string): Promise<Developer | null>;
  abstract findByEmail(email: string): Promise<Developer | null>;
}
