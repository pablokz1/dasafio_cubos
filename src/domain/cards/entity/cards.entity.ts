export type CardsProps = {
    id: string;
    type: string;
    number: string;
    cvv: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Cards {
    private constructor(private props: CardsProps) {}

    public static create(type: string, number: string, cvv: string) { 
        return new Cards({
            id: crypto.randomUUID(),
            type,
            number,
            cvv,
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