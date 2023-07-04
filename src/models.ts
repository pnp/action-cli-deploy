export interface SpoApp {
    CheckInComment: string,
    CheckOutType: number,
    ContentTag: string;
    CustomizedPageStatus: number,
    ETag: string
    Exists: boolean,
    ExistsAllowThrowForPolicyFailures: boolean,
    IrmEnabled: boolean,
    Length: string,
    Level: boolean,
    LinkingUri: string | null,
    LinkingUrl: string,
    MajorVersion: number,
    MinorVersion: number,
    Name: string,
    ServerRelativeUrl: string,
    TimeCreated: string,
    TimeLastModified: string,
    Title: string,
    UIVersion: number
    UIVersionLabel: string,
    UniqueId: string
}
