export class ServiceTypeRequestDto {

    constructor() {

        this.Name = '';
        this.ServiceId = 0;
        this.Remarks = "";
        this.IsActive = true;
    }
    public Name: string;
    public ServiceId: number;
    public Remarks: string;
    public IsActive: boolean;
}

export class ServiceTypeFilterDto {

    constructor() {
        this.Name = "";
        this.ServiceId = 0;
        this.IsActive = true;
    }
    public Name: string;
    public ServiceId: number;
    public IsActive: boolean;
}
