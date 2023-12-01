export enum UserTypeEnum {
    None = 0,
    Admin = 1,
    Common = 2,
}

export const getUserTypeEnumValue = (type: UserTypeEnum | number) => {
    switch (type) {
        case UserTypeEnum.Admin:
            return "Admin"
        case UserTypeEnum.Common:
            return "Comum"
    }
}