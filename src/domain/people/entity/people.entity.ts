import { BaseEntity, BaseEntityProps } from "../../base/base.entity";

export type PeopleProps = BaseEntityProps & {
    name: string;
    document: string;
    password: string;
};

export class People extends BaseEntity<PeopleProps> {
    private constructor(props: PeopleProps) {
        super(props);
    }

    public static create(name: string, document: string, password: string) {
        const now = new Date();
        return new People({
            id: crypto.randomUUID(),
            name,
            document,
            password,
            createdAt: now,
            updatedAt: now,
        });
    }

    public static with(props: PeopleProps) {
        return new People(props);
    }

    public get name() {
        return this.props.name;
    }

    public get document() {
        return this.props.document;
    }

    public get password() {
        return this.props.password;
    }

}