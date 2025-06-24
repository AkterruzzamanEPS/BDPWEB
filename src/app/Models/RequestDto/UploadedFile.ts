export class UploadedFileRequestDto {
  constructor() {
    this.Name = '';
    this.UserId = '';
    this.IsActive = true;
  }

  public Name: string;
  public UserId: string;
  public IsActive: boolean;
}



export class UploadedFileFilterDto {
  constructor() {
    this.Name = '';
    this.UserId = '';
    this.IsActive = true;
  }

  public Name: string;
  public UserId: string;
  public IsActive: boolean;
}
