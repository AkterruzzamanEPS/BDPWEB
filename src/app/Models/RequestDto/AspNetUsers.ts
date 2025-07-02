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
        this.FullName = '';
        this.Email = '';
        this.PhoneNumber = '';
        this.Password = '';
        this.ConfirmPassword = '';
        this.CurrentPassword = '';
        this.UserType = 0;
        this.NIDNo = '';
        this.Latitude = 0;
        this.Longitude = 0;
        this.Designation = '';
        this.Address = '';
        this.FileId = 0;
        this.RoleId = 0;
        this.IsActive = true;
    }
    public FullName: string;
    public Email: string;
    public PhoneNumber: string;
    public Password: string;
    public ConfirmPassword: string;
    public CurrentPassword: string;
    public UserType: number;
    public NIDNo: string;
    public Latitude: number;
    public Longitude: number;
    public Designation: string;
    public Address: string;
    public FileId: number;
    public RoleId: number;
    public IsActive: boolean;

}