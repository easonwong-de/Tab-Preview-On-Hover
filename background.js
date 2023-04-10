function update() {
	browser.tabs.query({ currentWindow: true }).then((tabs) => {
		console.log(tabs);
		const promises = tabs.map((tab) =>
			browser.tabs.captureTab(tab.id, { format: "jpeg", quality: 60, rect: { x: 0, y: 0, width: tab.width, height: tab.width * 0.75 } })
		);

		Promise.all(promises).then((screenshots) => {
			console.log(screenshots);
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
