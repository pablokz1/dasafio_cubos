export type AccountsProps = {
    id: string;
    branch: string;
    account: string;
    balance: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Accounts {
    private constructor(private props: AccountsProps) {}

    public static create(name: string, document: string, password: string) { 
        return new Accounts({
            id: crypto.randomUUID(),
            branch: name,
            account: document,
            balance: password,
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

}