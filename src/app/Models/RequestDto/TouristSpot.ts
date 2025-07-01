export class TouristSpotRequestDto {
  constructor() {
    this.Name = '';
    this.FileId = 0;
    this.TouristZoneId = 0;
    this.DistictId = 0;
    this.Type = 0;
    this.ThanaId = 0;
    this.PhoneNo = '';
    this.TelePhone = '';
    this.Description = '';
    this.Lat = '';
    this.Long = '';
    this.Remarks = '';
    this.IsActive = true;
    this.InchargeName= '';
    this.Address= '';
  }

  public Name: string;
  public FileId: number;
  public TouristZoneId: number;
  public DistictId: number;
  public Type: number;
  public ThanaId: number;
  public PhoneNo: string;
  public TelePhone: string;
  public Description: string;
  public Lat: string;
  public Long: string;
  public Remarks: string;
  public IsActive: boolean;
  public InchargeName : string;
  public Address : string;
}



export class TouristSpotFilterDto {
  constructor() {
    this.Name = '';
    this.TouristZoneId = 0;
    this.DistictId = 0;
    this.Type = 0;
    this.ThanaId = 0;
    this.PhoneNo = '';
    this.Lat = '';
    this.Long = '';
    this.IsActive = true;
  }

  public Name: string;
  public TouristZoneId: number;
  public DistictId: number;
  public Type: number;
  public ThanaId: number;
  public PhoneNo: string;
  public Lat: string;
  public Long: string;
  public IsActive: boolean;
}
