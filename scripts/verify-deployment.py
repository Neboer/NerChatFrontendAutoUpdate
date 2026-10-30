import json
from pathlib import Path
import subprocess
import sys

result = json.loads(Path(f'.work/{sys.argv[1]}.json').read_text())
assert result['status'] == 'success'
subprocess.run([sys.executable, 'scripts/verify.py', result['url']], check=True)
