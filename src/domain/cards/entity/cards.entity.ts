export type CardProps = {
    id: string;
    accountId: string;
    type: 'physical' | 'virtual';
    number: string;
    cvv: string;
    createdAt: Date;
    updatedAt: Date;
};

export class Card {
    private constructor(private props: CardProps) { }

    public static create(accountId: string, type: 'physical' | 'virtual', number: string, cvv: string) {
        return new Card({
            id: crypto.randomUUID(),
            accountId,
            type,
            number,
            cvv,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    public static with(props: CardProps) {
        return new Card(props);
    }

    public get id() {
        return this.props.id;
    }

    public get type() {
        return this.props.type;
    }

    public get number() {
        return this.props.number;
    }

    public get cvv() {
        return this.props.cvv;
    }

    public get accountId() {
        return this.props.accountId;
    }

    public get createdAt() {
        return this.props.createdAt;
    }

    public get updatedAt() {
        return this.props.updatedAt;
    }
}
