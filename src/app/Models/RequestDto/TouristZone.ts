export class TouristZoneRequestDto {
  constructor() {
    this.Name = '';
    this.FileId = 0;
    this.DistictId = 0;
    this.Description = '';
    this.Remarks = '';
    this.IsActive = true;
  }

  public Name: string;
  public FileId: number;
  public DistictId: number;
  public Description: string;
  public Remarks: string;
  public IsActive: boolean;
}



export class TouristZoneFilterDto {
  constructor() {
    this.Name = '';
    this.IsActive = true;
  }

  public Name: string;
  public IsActive: boolean;
}
