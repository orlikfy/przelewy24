export interface PaymentMethodsResponse {
    responseCode: string;
    agreements: any[][];
    data: {
        name: string;
        id: number;
        group: string;
        subgroup: string;
        status: boolean;
        imgUrl: string;
        mobileImgUrl: string;
        mobile: boolean;
        availabilityHours: {
            mondayToFriday: string;
            saturday: string;
            sunday: string;
        };
    }[];
}
