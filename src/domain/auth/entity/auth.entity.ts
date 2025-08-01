export type AuthProps = {
    document: string;
    password: string;
};

export class Auth {
    private constructor(private props: AuthProps) { }

    public static create(document: string, password: string) {

        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters.");
        }

        return new Auth({
            document,
            password,
        });
    }

    public static with(props: AuthProps) {
        return new Auth(props);
    }

    public get document() {
        return this.props.document;
    }

    public get password() {
        return this.props.password;
    }
}
