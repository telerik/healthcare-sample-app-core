import { execSync } from 'child_process';

export default function () {
    try {
        execSync('npx kendo-e2e close --all', { stdio: 'ignore' });
    } catch {
        // ignore if no sessions to close
    }
}
