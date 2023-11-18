<script lang="ts">
	import { onMount } from 'svelte';

	// on load, get googleDriveUrl from the user clipboard
	let input = '';
	let output = '';
	onMount(() => {
		navigator.clipboard.readText().then((googleDriveUrl) => {
			input = googleDriveUrl;
			if (typeof googleDriveUrl !== 'string') {
				output = 'No URL found in clipboard';
				return;
			}
			const regex = /\/d\/(.*)\/view/;
			const match = googleDriveUrl.match(regex);
			if (!match) {
				output = 'No Google Drive URL found in clipboard';
				return;
			}
			const fileId = match[1];
			output = `https://drive.google.com/uc?id=${fileId}`;
			// paste to clipboard
			navigator.clipboard.writeText(output).then(() => {
				console.log('Copied to clipboard: ' + output);
			});
		});
	});
</script>

<p>Input: {input}</p>
<p>Output: {output}</p>
