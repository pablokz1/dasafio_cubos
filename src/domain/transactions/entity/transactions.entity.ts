export type TransactionsProps = {
    id: string;
    value: number;
    description: string;
    accountId: string,
    createdAt: Date;
    updatedAt: Date;
    revertedFromId: string | null;
}

export class Transactions {
    private constructor(private props: TransactionsProps) { }

    public static create(accountId: string, value: number, description: string) {
        return new Transactions({
            id: crypto.randomUUID(),
            accountId: accountId,
            description,
            value,
            revertedFromId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static internalTransaction(receiverAccountId: string, accountId: string, value: number, description: string) {
        return new Transactions({
            id: crypto.randomUUID(),
            value,
            description,
            accountId,
            revertedFromId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static reverse(transaction: Transactions, accountId: string): Transactions {
        return new Transactions({
            id: crypto.randomUUID(),
            value: -transaction.value,
            accountId: accountId,
            description: `reversal: ${transaction.description}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            revertedFromId: transaction.id
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

    public get accountId() {
        return this.props.accountId
    }

    public get description() {
        return this.props.description;
    }

    public get createdAt() {
        return this.props.createdAt;
    }

    public get updatedAt() {
        return this.props.updatedAt;
    }

    public get revertedFromId() {
        return this.props.revertedFromId
    }

}