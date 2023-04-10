function update() {
	browser.tabs.query({ currentWindow: true }).then((tabs) => {
		const screenshots = [];
		for (let i = 0; i < Math.min(10, tabs.length); i++) {
			screenshots.push(
				browser.tabs.captureTab(tabs[i].id, {
					format: "jpeg",
					quality: 50,
					scale: 0.5
				})
			);
		}
		Promise.all(screenshots).then((screenshots) => {
			browser.theme.getCurrent().then((currentTheme) => {
				const newTheme = {
					...currentTheme,
					images: {
						...currentTheme.images,
						additional_backgrounds: screenshots,
					},
				};
				browser.theme.update(currentTheme.windowId, newTheme);
			});
		});
	});
}

browser.tabs.onUpdated.addListener(update); //When new tab is opened / reloaded
browser.tabs.onActivated.addListener(update); //When switch tabs
browser.tabs.onAttached.addListener(update); //When attach tab to windows
browser.windows.onFocusChanged.addListener(update); //When new window is opened
browser.runtime.onInstalled.addListener(update);
