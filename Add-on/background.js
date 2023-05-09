function update() {
	browser.windows.getAll({ populate: true }).then((windows) => {
		windows.forEach((window) => {
			const tabs = window.tabs;
			const data = [];
			const capture_para = {
				format: "jpeg",
				quality: 75,
				scale: 0.5,
			};
			for (let i = 0; i < Math.min(10, tabs.length); i++) {
				if (tabs[i].status == "complete") {
					if (tabs[i].discarded) {
						browser.tabs.reload(tabs[i].id).then(() => {
							data.push(browser.tabs.captureTab(tabs[i].id, capture_para));
						});
					} else {
						data.push(browser.tabs.captureTab(tabs[i].id, capture_para));
					}
				} else {
					data.push(
						"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // transparent png
					);
				}
			}
			Promise.all(data).then((screenshots) => {
				browser.theme.getCurrent(window.id).then((theme) => {
					theme.images = { additional_backgrounds: screenshots };
					browser.theme.update(window.id, theme);
				});
			});
		});
	});
}

browser.runtime.onInstalled.addListener(update);

setInterval(update, 2000);
