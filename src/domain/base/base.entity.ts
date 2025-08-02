export type BaseEntityProps = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export abstract class BaseEntity<T extends BaseEntityProps> {
    protected constructor(protected props: T) { }

    public get id() {
        return this.props.id;
    }

    public get createdAt() {
        return this.props.createdAt;
    }

    public get updatedAt() {
        return this.props.updatedAt;
    }
}
