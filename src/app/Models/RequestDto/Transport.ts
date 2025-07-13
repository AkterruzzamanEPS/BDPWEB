export class TransportRequestDto {

    constructor() {
        this.Id = 0;
        this.ServiceId = 0;
        this.Name = "";
        this.Description = "";
        this.Type = "0";
        this.Latitude = "";
        this.Longitude = "";
        this.StartTime = "00.00.00";
        this.EndTime = "00.00.00";
        this.seat = 0; 
        this.StartingPoint = "";
        this.EndingPoint = "";
        this.FileId = 0 ;
        this.Model = "";
        this.Cost = 0;
        this.PhoneNo = "";
        this.Address = "";
        this.Driver = "";
        this.Remarks = "";
        this.UserId = 0;
        this.IsActive = true;

    }
    public Id : number;
    public ServiceId : number;
    public Name : string;
    public Description : string;
    public Type:  string;
    public Latitude: string;
    public Longitude: string;
    public StartTime : string;
    public EndTime :string;
    public seat : number;
    public StartingPoint : string;
    public EndingPoint : string;
    public FileId : number;
    public Model : string;
    public Cost : number;
    public PhoneNo : string;
    public Address : string;
    public Driver : string;
    public Remarks : string;
    public UserId : number;
    public IsActive : boolean;
}


export class TransportFilterDto {
    constructor() {
        this.ServiceId = 0;
        this.Name = "";
        this.Type = "0";
        this.Longitude = "";
        this.Latitude = "";
        this.StartingPoint = "";
        this.EndingPoint = "";
        this.IsActive = true;
    }
    public ServiceId: number;
    public Name: string;
    public Type: string;
    public Longitude: string;
    public Latitude: string;
    public StartingPoint: string;
    public EndingPoint: string;
    public IsActive: boolean;
}
