import { Entity } from "@/core/entity";
import { Optional } from "@/core/types/optional";

export interface DeveloperProps {
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

  set name(name: string) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get bio(): string | null {
    return this.props.bio;
  }

  set bio(bio: string | null) {
    this.props.bio = bio;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<DeveloperProps, "createdAt" | "bio">,
    id?: string
  ) {
    return new Developer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        bio: props.bio ?? null,
      },
      id
    );
  }
}
