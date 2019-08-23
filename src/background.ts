import * as rtfToHTML from '@iarna/rtf-to-html';

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
        document.execCommand('Paste');
        const text = input.value;
        input.remove();
        rtfToHTML.fromString(text, {}, (err, html) => {
            if (err) {
                alert(html);
            }
            alert(html);
        });
    }
});
