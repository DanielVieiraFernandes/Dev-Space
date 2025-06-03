import { Entity } from "@/core/entity";
import { Optional } from "@/core/types/optional";

interface DeveloperProps {
  name: string;
  email: string;
  password: string;
  bio: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Developer extends Entity<DeveloperProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get bio() {
    return this.props.bio;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<DeveloperProps, "createdAt">, id?: string) {
    return new Developer(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );
  }
}
