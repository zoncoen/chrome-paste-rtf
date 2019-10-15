import * as rtfToHTML from '@iarna/rtf-to-html';

interface Clipboard {
    read(): Promise<DataTransfer>;
}
interface NavigatorClipboard {
    readonly clipboard?: Clipboard;
}
interface NavigatorExtended extends NavigatorClipboard {}

const id: string = 'pasteRTF';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: id,
        title: 'Paste RTF as styled text',
        contexts: ['editable'],
    });
});

chrome.contextMenus.onClicked.addListener(info => {
    if (info.menuItemId == id) {
        const input = document.createElement('textArea') as HTMLTextAreaElement;
        document.body.appendChild(input);
        input.focus();
        input.select();

        input.addEventListener('paste', e => {
            if (e.clipboardData && e.clipboardData.items) {
                for (var i = 0; i < e.clipboardData.items.length; i++) {
                    if (e.clipboardData.items[i].type == 'text/rtf') {
                        console.log('rtf');
                        e.clipboardData.items[i].getAsString(text => {
                            console.log(text);
                            rtfToHTML.fromString(text, {}, (err, html) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log(html);
                                }
                            });
                        });
                    }
                }
            }
        });
        document.execCommand('Paste');

        const text = input.value;
        input.remove();
    }
});
