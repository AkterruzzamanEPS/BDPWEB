export class FeedBacKRequestDto {
    constructor() {
        this.ID = 0;
        this.ReferanceTypeID = 0;
        this.ReferanceType = 0;
        this.Feedback = "";
        this.Remarks = "";
        this.IsActive = true;
        this.CreatedBy = "";
        this.CreatedDate = new Date();
    }

    public ID: number ;
    public ReferanceTypeID: number ;
    public ReferanceType: number ;
    public Feedback: string ;
    public Remarks: string;
    public IsActive: boolean ;
    public CreatedBy: string ;
    public CreatedDate: Date ;
}

export class FeedBacKFilterDto {
    constructor() {
        this.ReferanceTypeID = 0;
        this.ReferanceType = 0;
        this.Feedback = "";
        this.UserName = "";
        this.FullName = "";
        this.IsActive = true ;
        this.FromDate = new Date();
        this.ToDate = new Date();
    }

    public ReferanceTypeID: number ;
    public ReferanceType: number ;
    public Feedback: string ;
    public UserName: string ;
    public FullName: string ;
    public IsActive: boolean ;
    public FromDate: Date ;
    public ToDate: Date ;
}
