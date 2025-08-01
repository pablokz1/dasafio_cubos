export type PeopleProps = {
    id: string;
    name: string;
    document: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class People {
    private constructor(private props: PeopleProps) { 
    }

    public static create(name: string, document: string, password: string) { 
        return new People({
            id: crypto.randomUUID(),
            name,
            document,
            password,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static with(props: PeopleProps) {
        return new People(props);
    }

    public get id() {
        return this.props.id;
    }

    public get name() {
        return this.props.name;
    }

    public get document() {
        return this.props.document;
    }

    public get createdAt() {
        return this.props.createdAt;
    }

    public get updatedAt() {
        return this.props.updatedAt;
    }

}