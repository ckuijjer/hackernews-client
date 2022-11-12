import qrcode from 'qrcode';

const updateId = process.argv.at(-1);

const qr = await qrcode.toString(`exp://u.expo.dev/update/${updateId}`, {
  type: 'terminal',
});

const qrWithReplacementsForGitHubActionsOutput = qr
  .replaceAll('\x1b[40m  \x1b[0m', '\u001b[40;30m\u2003\u2003\u001b[0m') // replace 2 black background spaces with 2 black foreground and background em spaces
  .replaceAll('\x1b[47m  \x1b[0m', '\u001b[47;37m\u2003\u2003\u001b[0m'); // replace 2 white background spaces with 2 white foreground and background em spaces

console.log(qrWithReplacementsForGitHubActionsOutput);
