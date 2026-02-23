const vscode = require('vscode');

const PREFIX = 'status';
const SEPARATOR = ':';

const CODES = [
  { code: '001', title: 'Initial commit', desc: 'Initialization' },
  { code: '002', title: 'Base structure established', desc: 'Initialization' },
  { code: '003', title: 'Create / delete file', desc: 'Initialization' },
  { code: '101', title: 'Draft or scaffolding', desc: 'In Progress' },
  { code: '102', title: 'Partial implementation (WIP)', desc: 'In Progress' },
  { code: '201', title: 'Working as expected', desc: 'Stable / Working' },
  { code: '202', title: 'Verified with real usage', desc: 'Stable / Working' },
  { code: '203', title: 'Documentation updated', desc: 'Stable / Working' },
  { code: '204', title: 'Production-ready', desc: 'Stable / Working' },
  { code: '300', title: 'Refactoring (no functional change)', desc: 'Change / Improvement' },
  { code: '301', title: 'Feature added', desc: 'Change / Improvement' },
  { code: '302', title: 'Enhancement or improvement', desc: 'Change / Improvement' },
  { code: '401', title: 'Incorrect data flow or usage', desc: 'Design / Usage Issues' },
  { code: '403', title: 'Scope or responsibility issue', desc: 'Design / Usage Issues' },
  { code: '408', title: 'Performance / latency issues', desc: 'Design / Usage Issues' },
  { code: '500', title: 'Not working / runtime failure', desc: 'Broken / Failure' },
  { code: '502', title: 'Interface or contract mismatch', desc: 'Broken / Failure' },
  { code: '503', title: 'Security / auth failure', desc: 'Broken / Failure' },
  { code: '601', title: 'Bug or failure fixed', desc: 'Recovery' },
  { code: '603', title: 'Structure or state corrected', desc: 'Recovery' },
  { code: '404', title: 'Human state / chaos', desc: 'Special' },
  { code: 'infinity', title: 'Gold Master / fully stable', desc: 'Special' }
];

function makeSnippet(code) {
  return `${PREFIX}(${code})${SEPARATOR} $1`;
}

function makeCompletionItems() {
  return CODES.map((c) => {
    const label = `${PREFIX}(${c.code})${SEPARATOR} ${c.title}`;
    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
    item.insertText = new vscode.SnippetString(makeSnippet(c.code));
    item.detail = c.desc;
    item.documentation = c.title;
    item.filterText = `${PREFIX}(${c.code})`;
    return item;
  });
}

function insertSnippet(text) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.insertSnippet(new vscode.SnippetString(text), editor.selection.active);
    return;
  }

  if (vscode.scm && vscode.scm.inputBox) {
    vscode.scm.inputBox.value = text.replace('$1', '');
    return;
  }

  vscode.window.showInformationMessage('Open a commit message editor or SCM input box first.');
}

async function pickAndInsert() {
  const picks = CODES.map((c) => ({
    label: `${PREFIX}(${c.code})${SEPARATOR} ${c.title}`,
    description: c.desc,
    code: c.code
  }));

  const pick = await vscode.window.showQuickPick(picks, {
    placeHolder: 'Choose a STATUS code'
  });

  if (!pick) {
    return;
  }

  insertSnippet(makeSnippet(pick.code));
}

function activate(context) {
  const provider = vscode.languages.registerCompletionItemProvider(
    { language: 'git-commit' },
    {
      provideCompletionItems() {
        return makeCompletionItems();
      }
    },
    's', 'S', '('
  );

  const command = vscode.commands.registerCommand('statusCommit.insertCode', pickAndInsert);

  context.subscriptions.push(provider, command);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
