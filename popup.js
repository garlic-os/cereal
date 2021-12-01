// Beats per minute to milliseconds per beat
function bpm2beatInterval(bpm) {
	return 60000 / bpm;
}

async function sendMessage(message) {
	const [ activeTab ] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	chrome.tabs.sendMessage(activeTab.id, message);
}


document.addEventListener("DOMContentLoaded", async () => {
	const bpmInput = document.getElementById("bpm");
	let bpm = (await chrome.storage.sync.get(["bpm"])).bpm ?? 0;
	bpmInput.value = bpm;

	function pollForBPMChange() {
		if (bpm !== bpmInput.value) {
			bpm = bpmInput.value;
			sendMessage(bpm2beatInterval(bpm));
			chrome.storage.sync.set({ bpm: bpm });
		}
		requestAnimationFrame(pollForBPMChange);
	}
	requestAnimationFrame(pollForBPMChange);

	sendMessage(bpm2beatInterval(bpm));

	const clearButton = document.getElementById("clear-button");
	clearButton.addEventListener("click", () => {
		bpmInput.value = 0;
	});
});
