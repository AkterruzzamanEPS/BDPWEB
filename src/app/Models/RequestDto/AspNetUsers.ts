export class AspNetUsersFilterRequestDto {
    constructor() {
        this.Name = '';
        this.Email = '';
        this.UserType = 0;
        this.IsActive = true;
    }
    public Name: string;
    public Email: string;
    public UserType: number;
    public IsActive: boolean;
}


export class AspNetUsersRequestDto {

    constructor() {
        this.fullName = "";
        this.email = "";
        this.phoneNumber = '';
        this.password = '';
        this.confirmPassword = '';
        this.Type = 0;
        this.ipAddress = "";
        this.roleId = "";
    }
    public fullName: string;
    public email: string;
    public phoneNumber: string;
    public password: string;
    public confirmPassword: string;
    public Type: number;
    public ipAddress: string;
    public roleId: string
}