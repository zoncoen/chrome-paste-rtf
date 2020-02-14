import * as rtfToHTML from "@iarna/rtf-to-html";

interface Clipboard {
    read(): Promise<DataTransfer>;
}
interface NavigatorClipboard {
    readonly clipboard?: Clipboard;
}
interface NavigatorExtended extends NavigatorClipboard {}

const id: string = "pasteRTF";

chrome.runtime.onInstalled.addListener(() => {
    chrome.commands.onCommand.addListener(command => {
        if (command === "paste") {
            const input = document.createElement(
                "textArea"
            ) as HTMLTextAreaElement;
            document.body.appendChild(input);

            input.addEventListener("paste", e => {
                const items = e.clipboardData!.items!;
                for (var i = 0; i < items.length; i++) {
                    items[i].getAsString(text => {
                        if (items[i]) {
                            console.log(items[i].type);
                        }
                        if (items[i] && items[i].type == "text/rtf") {
                            rtfToHTML.fromString(text, {}, (err, html) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    document.body.innerHTML = html;
                                    getSelection()!.selectAllChildren(
                                        document.body
                                    );
                                    document.execCommand("copy");
                                    paste();
                                }
                            });
                        } else {
                            console.log(text);
                            paste();
                        }
                    });
                }
            });

            input.focus();
            input.select();
            document.execCommand("paste");
        }
    });
});

function paste() {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true,
            windowId: chrome.windows.WINDOW_ID_CURRENT
        },
        function(tabs) {
            var currentTab = tabs.shift();
            chrome.tabs.sendMessage(currentTab!.id!, "", function() {});
        }
    );
}

// chrome.contextMenus.onClicked.addListener(info => {
//   if (info.menuItemId == id) {
//     const input = document.createElement('textArea') as HTMLTextAreaElement;
//     document.body.appendChild(input);
//
//     input.addEventListener('paste', e => {
//       const items = e.clipboardData!.items!;
//       for (var i = 0; i < items.length; i++) {
//         if (items[i].type == 'text/rtf') {
//           items[i].getAsString(text => {
//             console.log(text);
//             rtfToHTML.fromString(text, {}, (err, html) => {
//               if (err) {
//                 console.error(err);
//               } else {
//                 console.log(html);
//                 document.body.innerHTML = html;
//                 getSelection()!.selectAllChildren(document.body);
//                 document.execCommand('copy');
//               }
//             });
//           });
//         }
//       }
//     });
//
//     input.focus();
//     input.select();
//     document.execCommand('paste');
//   }
// });
