import { BaseEntity, BaseEntityProps } from "../../base/base.entity";

export type AccountsProps = BaseEntityProps & {
    idPeople: string;
    branch: string;
    account: string;
    balance: number;
    isActive: boolean;
}

export class Accounts extends BaseEntity<AccountsProps> {
    private constructor(props: AccountsProps) {
        super(props)
    }

    public static create(branch: string, account: string, idPeople: string) {
        const now = new Date();
        return new Accounts({
            id: crypto.randomUUID(),
            idPeople,
            branch,
            account,
            balance: 0,
            isActive: true,
            createdAt: now,
            updatedAt: now
        });
    }

    public static with(props: AccountsProps) {
        return new Accounts(props);
    }

    public get branch() {
        return this.props.branch;
    }

    public get account() {
        return this.props.account;
    }

    public get balance() {
        return this.props.balance;
    }

    public get idPeople() {
        return this.props.idPeople;
    }

    public get isActive() {
        return this.props.isActive;
    }

    public deposit(amount: number) {
        if (amount <= 0) {
            throw new Error("Deposit amount must be greater than zero.");
        }
        this.props.balance += amount;
        this.props.updatedAt = new Date();
    }

    public withdraw(amount: number) {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be greater than zero.");
        }
        if (amount > this.props.balance) {
            throw new Error("Insufficient balance for withdrawal.");
        }
        this.props.balance -= amount;
        this.props.updatedAt = new Date();
    }

}