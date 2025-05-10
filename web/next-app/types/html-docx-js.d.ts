declare module 'html-docx-js' {
  const htmlDocx: {
    asBlob: (html: string) => Blob;
    asArrayBuffer: (html: string) => ArrayBuffer;
    asBase64: (html: string) => string;
  };
  export default htmlDocx;
} 