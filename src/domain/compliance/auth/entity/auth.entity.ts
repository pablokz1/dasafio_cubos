export type AuthProps = {
    email: string;
    password: string;
};

export class Auth {
    private constructor(private props: AuthProps) { }

    public static create(email: string, password: string, role: 'user' | 'admin' = 'user') {
        if (!email || !Auth.validateEmail(email)) {
            throw new Error("Invalid email.");
        }
        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters.");
        }

        return new Auth({
            email,
            password,
        });
    }

    public static with(props: AuthProps) {
        return new Auth(props);
    }


    public get email() {
        return this.props.email;
    }

    public get password() {
        return this.props.password;
    }

    private static validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
