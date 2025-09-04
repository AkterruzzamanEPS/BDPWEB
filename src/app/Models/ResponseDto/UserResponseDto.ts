export class UserResponseDto {
    constructor(
    ) {
        this.JwtToken = "";
        this.Expires = "";
        this.RefreshToken = "";
        this.RefreshTokenExpires = "";
        this.UserId = "";
        this.companyLogo = "";
        this.UserType=0;
    }
    public JwtToken: string;
    public Expires: string;
    public RefreshToken: string;
    public RefreshTokenExpires: string;
    public UserId: string;
    public UserType: number;
    public companyLogo: string;
}