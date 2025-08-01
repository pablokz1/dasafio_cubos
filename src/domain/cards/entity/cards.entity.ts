export type CardsProps = {
    id: string;
    idAccount: string;
    type: string;
    number: string;
    cvv: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Cards {
    private constructor(private props: CardsProps) {}

    public static create(type: string, number: string, cvv: string, idAccount: string) { 
        return new Cards({
            id: crypto.randomUUID(),
            idAccount,
            type,
            number,
            cvv,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static with(props: CardsProps) {
        return new Cards(props);
    }

    public get id() {
        return this.props.id;
    }

    public get idAccount() {
        return this.props.idAccount
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

}