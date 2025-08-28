export class AccessUserRequestDto {

  constructor() {
    this.ID = 0;
    this.Remarks = '';
    this.IsActive = true;
    this.CreatedBy = '';
    this.CreatedDate = new Date();

    // business
    this.Type = 0;
    this.TypeId = 0;
    this.UserId = null;
    this.AccessList = [];
  }

  public ID: number;
  public Remarks: string;
  public IsActive: boolean;
  public CreatedBy: string;
  public CreatedDate: Date;

  // business
  public Type: number;   // define user type
  public TypeId: number; // area/zone ID
  public UserId: string | null;

  public AccessList: number[];
}

export class AccessUserFilterDto {

  constructor() {
    this.UserId = null;
    this.StartDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
    this.EndDate = new Date();
    this.Type = 0;
    this.TypeId = 0;
    this.IsActive = true;
  }

  public UserId: string | null;
  public StartDate: Date;
  public EndDate: Date;
  public Type: number ;   // define user type
  public TypeId: number ; // area/zone ID
  public IsActive: boolean ;
}
