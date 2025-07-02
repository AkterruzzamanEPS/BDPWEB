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
       
        
      
    }
    public Name: string;
    public ShortName: string;
    public RoutingPath: string;
    public IsActive: boolean;
    public Remarks: string;
    
}