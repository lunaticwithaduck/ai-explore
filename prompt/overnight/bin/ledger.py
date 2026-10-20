"""Update the overnight ledger.

  ledger.py set <id> key=value [key=value ...]   columns: status base head rounds verdict cause loc
  ledger.py event "<text>"                        appends "- HH:MM <text>" under ## Events
  ledger.py decision "<text>"                     appends "- HH:MM · <text>" under ## Decisions
"""
import datetime
import os
import sys

LEDGER = os.path.join(os.path.dirname(__file__), '..', 'ledger.md')
COLUMNS = ['id', 'phase', 'model', 'pri', 'title', 'depends on', 'INV', 'status', 'base', 'head',
           'rounds', 'verdict', 'cause', 'loc']


def now():
    return datetime.datetime.now().strftime('%H:%M')


def set_row(task_id, pairs):
    lines = open(LEDGER).read().split('\n')
    for i, line in enumerate(lines):
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if line.startswith('| ') and len(cells) == len(COLUMNS) and cells[0] == task_id:
            for pair in pairs:
                key, value = pair.split('=', 1)
                cells[COLUMNS.index(key)] = value
            lines[i] = '| ' + ' | '.join(cells) + ' |'
            open(LEDGER, 'w').write('\n'.join(lines))
            return
    sys.exit(f'no ledger row {task_id}')


def append_under(heading, text):
    content = open(LEDGER).read().rstrip('\n')
    start = content.index(heading)
    nxt = content.find('\n## ', start + len(heading))
    insert_at = len(content) if nxt == -1 else nxt
    content = content[:insert_at].rstrip('\n') + '\n' + text + '\n' + content[insert_at:]
    open(LEDGER, 'w').write(content.rstrip('\n') + '\n')


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'set':
        set_row(sys.argv[2], sys.argv[3:])
    elif cmd == 'event':
        append_under('## Events', f'- {now()} {sys.argv[2]}')
    elif cmd == 'decision':
        append_under('## Decisions', f'- {now()} · {sys.argv[2]}')
