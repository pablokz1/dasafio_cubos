export type TransactionsProps = {
    id: string;
    value: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Transactions {
    private constructor(private props: TransactionsProps) { }

    public static create(value: number, description: string) {
        return new Transactions({
            id: crypto.randomUUID(),
            value,
            description,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static internalTransaction(receiverAccountId: string, value: number, description: string) {
        return new Transactions({
            id: crypto.randomUUID(),
            value,
            description,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static with(props: TransactionsProps) {
        return new Transactions(props);
    }

    public get id() {
        return this.props.id;
    }

    public get value() {
        return this.props.value;
    }

    public get description() {
        return this.props.description;
    }

}