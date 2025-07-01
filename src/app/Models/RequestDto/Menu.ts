export class MenuFilterRequestDto {

    constructor() {
        this.Name = '';
        this.ShortName = '';
        this.IsActive=true;
    }
    public Name: string;
    public ShortName: string;
    public IsActive: boolean;
}

export class MenuRequestDto {

    constructor() {
        this.Name = '';
        this.ShortName = '';
        this.RoutingPath = '';
        this.IsActive = true;
        this.Remarks = '';
        this.IPAddress = '';
        
      
    }
    public Name: string;
    public ShortName: string;
    public RoutingPath: string;
    public IsActive: boolean;
    public Remarks: string;
    public IPAddress: string;
}