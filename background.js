// When the add-on is installed or upgraded, register a listener to capture tab screenshots
browser.runtime.onInstalled.addListener(() => {
	browser.tabs.onUpdated.addListener(handleTabUpdated);
});

// When a tab is updated, send a message to the content script to take a screenshot
async function handleTabUpdated(tabId, changeInfo, tab) {
	if (changeInfo.status === "complete") {
		// Get the current theme object
		const currentTheme = await browser.theme.getCurrent();

		// Capture a screenshot of the updated tab
		const screenshot = await browser.tabs.captureVisibleTab(tab.windowId, {
			format: "jpeg",
			quality: 60,
			rect: { width: 800, height: 600 },
		});

		// Update the theme object with the new screenshot
		const newTheme = {
			...currentTheme,
			images: {
				...currentTheme.images,
				additional_backgrounds: [screenshot],
			},
		};

		// Update the theme with the new object
		browser.theme.update(tab.windowId, newTheme);
	}
}

// Listen for messages from content scripts
browser.runtime.onMessage.addListener(async (message, sender) => {
	if (message.action === "screenshotTaken") {
		// Update the theme API with the captured screenshot
		browser.theme.update(sender.tab.windowId, {
			additional_backgrounds: [message.screenshot],
		});
	}
});
