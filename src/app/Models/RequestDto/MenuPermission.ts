export class MenuPermissionFilterRequestDto {

    constructor() {
        
        this.userID = '';
        this.IsActive = true;
    }


    public userID: string;
    public IsActive: boolean;
}

export class MenuPermissionRequestDto {

    constructor() {
        this.userID = '';
        this.menuId = 0;
       
        this.name = '';
        this.IsActive = true;
        this.remarks = '';
        this.iPAddress = '';


    }
    public userID: string;
    public menuId: number;
    
    public name: string;
    public remarks: string;
    public IsActive: boolean;
    public iPAddress: string;
}

export class MenuPerRequestDto {

    constructor() {
        this.userID = '';
       
        this.IsActive = true;
        this.remarks = '';
        this.iPAddress = '';
        this.menues = [];

    }
    public userID: string;
    public remarks: string;
    public IsActive: boolean;
    public iPAddress: string;
    public menues: Menues[];
}

export class Menues {

    constructor() {
        this.menuId = 0;
        this.name = '';
    }
    public menuId: number;
    public name: string;
}
