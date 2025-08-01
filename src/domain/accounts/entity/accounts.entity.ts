export type AccountsProps = {
    id: string;
    idPeople: string;
    branch: string;
    account: string;
    balance: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Accounts {
    private constructor(private props: AccountsProps) {}

    public static create(branch: string, account: string, idPeople: string) { 
        return new Accounts({
            id: crypto.randomUUID(),
            idPeople,
            branch,
            account,
            balance: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static with(props: AccountsProps) {
        return new Accounts(props);
    }

    public get id() {
        return this.props.id;
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