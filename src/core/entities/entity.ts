import { randomUUID } from 'node:crypto';

export class Entity<Props> {
  private _id: string;
  protected props: Props;

  constructor(props: Props, id?: string) {
    this._id = id ?? randomUUID();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true;
    }

    if (entity.id === this.id) {
      return true;
    }

    return false;
  }
}
