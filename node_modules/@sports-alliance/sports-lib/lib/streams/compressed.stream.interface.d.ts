import { StreamJSONInterface } from './stream';
export interface CompressedJSONStreamInterface extends StreamJSONInterface {
    type: string;
    data: any;
    compressionMethod: CompressionMethods;
    encoding: CompressionEncodings;
}
export declare enum CompressionEncodings {
    None = "None",
    Binary = "Binary",
    base64 = "base64",
    UInt8Array = "UInt8Array"
}
export declare enum CompressionMethods {
    None = "None",
    Pako = "Pako"
}
