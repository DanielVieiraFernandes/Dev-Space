import {
  Developer,
  DeveloperProps,
} from "@/dev-space/enterprise/entities/developer";
import { fakerPT_BR } from "@faker-js/faker";

export const makeDeveloper = (
  override: Partial<DeveloperProps>,
  id?: string
) => {
  return Developer.create(
    {
      name: fakerPT_BR.person.fullName(),
      email: fakerPT_BR.internet.email(),
      bio: fakerPT_BR.person.bio(),
      password: fakerPT_BR.internet.password(),
      ...override,
    },
    id
  );
};
