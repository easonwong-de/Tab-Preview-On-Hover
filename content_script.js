// Content scripts don't have access to the theme API, so we need to send a message to the background script to take a screenshot
browser.runtime.sendMessage({ action: "takeScreenshot" });

// Listen for messages from the background script
browser.runtime.onMessage.addListener(async (message) => {
	if (message.action === "takeScreenshot") {
		const screenshot = await browser.tabs.captureVisibleTab(null, {
			format: "jpeg",
			quality: 60,
		});

		browser.runtime.sendMessage({
			action: "screenshotTaken",
			screenshot: screenshot,
		});
	}
});
