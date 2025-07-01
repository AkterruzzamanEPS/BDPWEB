export class AspNetUsersFilterRequestDto {
    constructor() {
        this.name = '';
        this.isActive = true;
    }
    public name: string;
    public isActive: boolean;
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