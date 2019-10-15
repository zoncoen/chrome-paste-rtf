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
  chrome.commands.onCommand.addListener(command => {
    if (command === 'paste') {
      console.log('paste');

      const input = document.createElement('textArea') as HTMLTextAreaElement;
      document.body.appendChild(input);

      input.addEventListener('paste', e => {
        const items = e.clipboardData!.items!;
        for (var i = 0; i < items.length; i++) {
          if (items[i].type == 'text/rtf') {
            items[i].getAsString(text => {
              console.log(text);
              rtfToHTML.fromString(text, {}, (err, html) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(html);
                  document.body.innerHTML = html;
                  getSelection()!.selectAllChildren(document.body);
                  document.execCommand('copy');

                  chrome.tabs.query(
                    {
                      active: true,
                      windowId: chrome.windows.WINDOW_ID_CURRENT,
                    },
                    function(result) {
                      var currentTab = result.shift();
                      var message = 'paste!!!!!';
                      chrome.tabs.sendMessage(
                        currentTab!.id!,
                        message,
                        function() {},
                      );
                    },
                  );
                }
              });
            });
          }
        }
      });

      input.focus();
      input.select();
      document.execCommand('paste');
    }
  });
});

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
