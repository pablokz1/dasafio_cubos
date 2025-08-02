import { BaseEntity, BaseEntityProps } from "../../base/base.entity";

export type CardProps = BaseEntityProps & {
    accountId: string;
    type: 'physical' | 'virtual';
    number: string;
    cvv: string;
};

export class Card extends BaseEntity<CardProps> {
    private constructor(props: CardProps) {
        super(props);
    }

    public static create(accountId: string, type: 'physical' | 'virtual', number: string, cvv: string) {
        const now = new Date();
        return new Card({
            id: crypto.randomUUID(),
            accountId,
            type,
            number,
            cvv,
            createdAt: now,
            updatedAt: now,
        });
    }

    public static with(props: CardProps) {
        return new Card(props);
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
}

