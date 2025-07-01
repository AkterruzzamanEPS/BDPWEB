export class MenuPermissionFilterRequestDto {

    constructor() {
        
        this.userID = '';
        this.isActive = true;
    }


    public userID: string;
    public isActive: boolean;
}

export class MenuPermissionRequestDto {

    constructor() {
        this.userID = '';
        this.menuId = 0;
       
        this.name = '';
        this.isActive = true;
        this.remarks = '';
        this.iPAddress = '';


    }
    public userID: string;
    public menuId: number;
    
    public name: string;
    public remarks: string;
    public isActive: boolean;
    public iPAddress: string;
}

export class MenuPerRequestDto {

    constructor() {
        this.userID = '';
       
        this.isActive = true;
        this.remarks = '';
        this.iPAddress = '';
        this.menues = [];

    }
    public userID: string;
    public remarks: string;
    public isActive: boolean;
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
