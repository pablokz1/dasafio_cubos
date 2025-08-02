import { BaseEntity, BaseEntityProps } from "../../base/base.entity";

export type TransactionsProps = BaseEntityProps & {
    value: number;
    description: string;
    accountId: string,
    revertedFromId: string | null;
}

export class Transactions extends BaseEntity<TransactionsProps> {
    private constructor(props: TransactionsProps) {
        super(props)
    }

    public static create(accountId: string, value: number, description: string) {
        const now = new Date();
        return new Transactions({
            id: crypto.randomUUID(),
            accountId: accountId,
            description,
            value,
            revertedFromId: null,
            createdAt: now,
            updatedAt: now
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

    public get value() {
        return this.props.value;
    }

    public get accountId() {
        return this.props.accountId
    }

    public get description() {
        return this.props.description;
    }

    public get revertedFromId() {
        return this.props.revertedFromId
    }

}