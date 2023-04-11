function update() {
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
}

browser.runtime.onInstalled.addListener(update);

setInterval(update, 2500);
