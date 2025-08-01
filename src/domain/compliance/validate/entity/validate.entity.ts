export type ValidateProps = {
  document: string;
  status: number;
  reason: string;
};

export class Validate {
  private constructor(private props: ValidateProps) { }

  public static with(props: ValidateProps): Validate {
    return new Validate(props);
  }

  public get document(): string {
    return this.props.document;
  }

  public get status(): number {
    return this.props.status;
  }

  public get reason(): string {
    return this.props.reason;
  }

  public isValid(): boolean {
    return this.props.status === 1;
  }
}
