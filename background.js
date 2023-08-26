const screenshotSettings = { format: "jpeg", quality: 75, scale: 0.5 };
const canvasWidth = 400;
const canvasHeight = 300;
const textareaHeight = 200;
const textMargin = 20;
const textSize = 25;
const textSizeSmall = 20;

browser.runtime.onMessage.addListener((message) => {
	console.log(message);
});

function update() {
	browser.windows.getAll({ populate: true }).then((windows) => {
		windows.forEach((window) => {
			browser.theme.getCurrent(window.id).then((theme) => updateTheme(theme, window));
		});
	});
}

function updateTheme(theme, window) {
	let tabs = window.tabs;
	let tabPreviews = [];
	let backgroundColor = theme.colors.frame;
	let borderColor = theme.colors.popup_border;
	let textColor = theme.colors.toolbar_text;
	for (let i = 0; i < Math.min(10, tabs.length); i++) {
		let tab = tabs[i];
		// Canvas configs
		let canvas = document.createElement("canvas");
		let canvasContext = canvas.getContext("2d");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		// Background
		canvasContext.fillStyle = backgroundColor;
		canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
		canvasContext.fillStyle = "#000000";
		canvasContext.fillRect(0, 0, canvasWidth, textareaHeight);
		canvasContext.fillStyle = borderColor;
		canvasContext.fillRect(0, textareaHeight, canvasWidth, 2);
		// Info box
		canvasContext.textAlign = "left";
		canvasContext.textBaseline = "middle";
		let textColorFade = canvasContext.createLinearGradient(textMargin, 0, canvasWidth - textMargin, 0);
		textColorFade.addColorStop(0.9, textColor);
		textColorFade.addColorStop(1, "transparent");
		canvasContext.fillStyle = textColorFade;
		canvasContext.font = `normal normal 900 ${textSize}px apple-system, sans-serif, SF Pro, Arial`;
		canvasContext.fillText(tab.title, textMargin, textareaHeight + (canvasHeight - textareaHeight) / 2 - textSizeSmall / 2 - 5);
		canvasContext.font = `normal normal 100 ${textSizeSmall}px apple-system, sans-serif, SF Pro, Arial`;
		let hostname = new URL(tab.url).hostname;
		canvasContext.fillText(
			hostname === "" ? tab.url : hostname,
			textMargin,
			textareaHeight + (canvasHeight - textareaHeight) / 2 + textSize / 2 + 5
		);
		// Preview box
		let promise = new Promise((resolve) => {
			if (tab.status == "complete" && !tab.discarded) {
				let screenshot = new Image();
				screenshot.onload = () => {
					let tp_raw_ar = screenshot.width / screenshot.height;
					let tp_ar = canvasWidth / textareaHeight;
					if (tp_raw_ar > tp_ar)
						canvasContext.drawImage(
							screenshot,
							(screenshot.width - screenshot.height * tp_ar) / 2,
							0,
							screenshot.height * tp_ar,
							screenshot.height,
							0,
							0,
							canvasWidth,
							textareaHeight
						);
					else canvasContext.drawImage(screenshot, 0, 0, screenshot.width, screenshot.width / tp_ar, 0, 0, canvasWidth, textareaHeight);
					resolve(canvas.toDataURL("image/jpeg"));
					canvas.remove();
				};
				browser.tabs.captureTab(tab.id, screenshotSettings).then((tp_raw) => (screenshot.src = tp_raw));
			} else {
				// Placeholder text
				canvasContext.textAlign = "center";
				canvasContext.textBaseline = "middle";
				canvasContext.font = `50px apple-system, sans-serif, SF Pro, Arial`;
				canvasContext.fillStyle = textColor;
				canvasContext.fillText("Tab inactive", canvasWidth / 2, textareaHeight / 2);
				resolve(canvas.toDataURL("image/jpeg"));
				canvas.remove();
			}
		});
		tabPreviews.push(promise);
	}
	Promise.all(tabPreviews).then((tabPreviews) => {
		theme.images = { additional_backgrounds: tabPreviews };
		browser.theme.update(window.id, theme);
	});
}

browser.runtime.onInstalled.addListener(update);

setInterval(update, 2500);
