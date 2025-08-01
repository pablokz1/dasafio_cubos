export type TypeTransactionEnum = "TED" | "DOC" | "PIX" | "TRANSFERENCIA_INTERNA";

export const TypeTransactionEnum = {
  TED: 'TED' as TypeTransactionEnum,
  DOC: 'DOC' as TypeTransactionEnum,
  PIX: 'PIX' as TypeTransactionEnum,
  TRANSFERENCIA_INTERNA: 'TRANSFERENCIA_INTERNA' as TypeTransactionEnum,
} as const;
 
export type TransactionsProps = {
    id: string;
    idOriginAccount: string,
    idDestinyAccount: string,
    value: number;
    description: string;
    type: TypeTransactionEnum;
    createdAt: Date;
    updatedAt: Date;
}

export class Transactions {
    private constructor(private props: TransactionsProps) { }

    public static create(value: number, description: string, type: TypeTransactionEnum, idOriginAccount: string, idDestinyAccount: string) {
        return new Transactions({
            id: crypto.randomUUID(),
            idOriginAccount,
            idDestinyAccount,
            value,
            description,
            type,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static internalTransaction(receiverAccountId: string, value: number, description: string, type: TypeTransactionEnum, idOriginAccount: string, idDestinyAccount: string) {
        return new Transactions({
            id: crypto.randomUUID(),
            idOriginAccount,
            idDestinyAccount,
            value,
            description,
            type,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static reverse(transaction: Transactions): Transactions {
        return new Transactions({
            id: crypto.randomUUID(),
            idOriginAccount: transaction.idOriginAccount,
            idDestinyAccount: transaction.idDestinyAccount,
            value: -transaction.value,
            description: `reversal: ${transaction.description}`,
            type: transaction.type,
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

    public get type() {
        return this.props.type;
    }

    public get idOriginAccount() {
        return this.props.idOriginAccount;
    }

    public get idDestinyAccount() {
        return this.props.idDestinyAccount;
    }

}