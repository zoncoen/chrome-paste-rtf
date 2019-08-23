declare module '@iarna/rtf-to-html' {
    function fromString(text: string, opts: Options, cb: Callback): void;
}

interface Options {
    fontSize?: number;
}

type Callback = (err: Error, html: string) => void;
