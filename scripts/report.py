import json
import os
import subprocess

title = 'NerChat automatic deployment failed'
issues = json.loads(subprocess.check_output(['gh', 'issue', 'list', '--state', 'open', '--search', title + ' in:title', '--json', 'number,title']))
issue = next((i for i in issues if i['title'] == title), None)
run = f"https://github.com/{os.environ['GITHUB_REPOSITORY']}/actions/runs/{os.environ['GITHUB_RUN_ID']}"
if os.environ['JOB_STATUS'] == 'failure':
    body = f'Automatic update failed. Review the [Actions run]({run}).\n\nThe successful-release marker was not advanced. Pre-deployment failures do not change production.'
    if issue:
        subprocess.run(['gh', 'issue', 'comment', str(issue['number']), '--body', body], check=True)
    else:
        subprocess.run(['gh', 'issue', 'create', '--title', title, '--body', body], check=True)
elif os.environ['JOB_STATUS'] == 'success' and os.environ.get('DEPLOYED') == 'true' and issue:
    subprocess.run(['gh', 'issue', 'close', str(issue['number']), '--comment', f'Update checks passed: {run}'], check=True)
