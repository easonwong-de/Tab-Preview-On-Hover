function update() {
	setTimeout(() => {
		browser.windows.getAll({ populate: true }).then((windows) => {
			windows.forEach((window) => {
				const tabs = window.tabs;
				const screenshots = [];
				for (let i = 0; i < Math.min(10, tabs.length); i++) {
					screenshots.push(
						browser.tabs.captureTab(tabs[i].id, {
							format: "jpeg",
							quality: 50,
							scale: 0.5,
						})
					);
				}
				Promise.all(screenshots).then((screenshots) => {
					browser.theme.getCurrent(window.id).then((currentTheme) => {
						const newTheme = {
							...currentTheme,
							images: {
								additional_backgrounds: screenshots,
							},
						};
						browser.theme.update(window.id, newTheme);
					});
				});
			});
		});
	}, 50); // Sets delay to resolve potential conflicts with ATBC
}

browser.tabs.onUpdated.addListener(update); // When new tab is opened / reloaded
browser.tabs.onActivated.addListener(update); // When switch tabs
browser.tabs.onAttached.addListener(update); // When attach tab to windows
browser.tabs.onMoved.addListener(update); // When move tab within a window
browser.windows.onFocusChanged.addListener(update); // When new window is opened
browser.runtime.onInstalled.addListener(update);

update();
