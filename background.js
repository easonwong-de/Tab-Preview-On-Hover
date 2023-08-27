const screenshotSettings = { format: "jpeg", quality: 75, scale: 0.5 };
const canvasWidth = 400;
const canvasHeight = 300;
const tabPreviewWidth = canvasWidth;
const tabPreviewHeight = 200;
const textMargin = 20;
const textSize = 25;
const textSizeSmall = 20;

var updateInterval = setInterval(update, 2500);
const update_debounce = addDebounce(update);

browser.runtime.onMessage.addListener((message) => {
	console.log(message, Date.now());
	clearInterval(updateInterval);
	if (message == "TPOH_ON") {
		update_debounce();
		updateInterval = setInterval(update, 2500);
	}
});

browser.runtime.onMessageExternal.addListener((message) => {
	console.log(message, Date.now());
	if (message == "TPOH_UPDATE") update_debounce();
});

var debouncePrevRun = 0;
var debounceTimeout = null;

/**
 * Runs the given function with a maximum rate of 100ms.
 * @param {function} fn Fuction without debounce.
 * @returns Function with debounce.
 * @author cloone8 on GitHub.
 */
function addDebounce(fn) {
	const timeoutMs = 1000;
	return () => {
		const currentTime = Date.now();
		if (debounceTimeout) {
			// Clear pending function
			clearTimeout(debounceTimeout);
			debounceTimeout = null;
		}
		if (currentTime - timeoutMs > debouncePrevRun) {
			// No timeout => call the function right away
			debouncePrevRun = currentTime;
			fn();
		} else {
			// Blocked by timeout => delay the function call
			debounceTimeout = setTimeout(() => {
				debouncePrevRun = Date.now();
				debounceTimeout = null;
				fn();
			}, timeoutMs - (currentTime - debouncePrevRun));
		}
	};
}

function update() {
	console.log("update", Date.now());
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
		canvasContext.fillRect(0, 0, tabPreviewWidth, tabPreviewHeight);
		canvasContext.fillStyle = borderColor;
		canvasContext.fillRect(0, tabPreviewHeight, tabPreviewWidth, 2);
		// Info box
		canvasContext.textAlign = "left";
		canvasContext.textBaseline = "middle";
		let textColorFade = canvasContext.createLinearGradient(textMargin, 0, canvasWidth - textMargin, 0);
		textColorFade.addColorStop(0.9, textColor);
		textColorFade.addColorStop(1, "transparent");
		canvasContext.fillStyle = textColorFade;
		canvasContext.font = `normal normal 900 ${textSize}px apple-system, sans-serif, SF Pro, Arial`;
		canvasContext.fillText(tab.title, textMargin, tabPreviewHeight + (canvasHeight - tabPreviewHeight) / 2 - textSizeSmall / 2 - 5);
		canvasContext.font = `normal normal 100 ${textSizeSmall}px apple-system, sans-serif, SF Pro, Arial`;
		let hostname = new URL(tab.url).hostname;
		canvasContext.fillText(hostname || tab.url, textMargin, tabPreviewHeight + (canvasHeight - tabPreviewHeight) / 2 + textSize / 2 + 5);
		// Preview box
		let promise = new Promise((resolve) => {
			if (tab.status == "complete" && !tab.discarded) {
				let screenshot = new Image();
				screenshot.onload = () => {
					let screenshotAspectRatio = screenshot.width / screenshot.height;
					let tabPreviewAspectRatio = tabPreviewWidth / tabPreviewHeight;
					if (screenshotAspectRatio > tabPreviewAspectRatio)
						canvasContext.drawImage(
							screenshot,
							(screenshot.width - screenshot.height * tabPreviewAspectRatio) / 2,
							0,
							screenshot.height * tabPreviewAspectRatio,
							screenshot.height,
							0,
							0,
							tabPreviewWidth,
							tabPreviewHeight
						);
					else
						canvasContext.drawImage(
							screenshot,
							0,
							0,
							screenshot.width,
							screenshot.width / tabPreviewAspectRatio,
							0,
							0,
							tabPreviewWidth,
							tabPreviewHeight
						);
					resolve(canvas.toDataURL("image/jpeg"));
					canvas.remove();
				};
				browser.tabs.captureTab(tab.id, screenshotSettings).then((screenshotSource) => (screenshot.src = screenshotSource));
			} else {
				// Placeholder text
				canvasContext.textAlign = "center";
				canvasContext.textBaseline = "middle";
				canvasContext.font = `50px apple-system, sans-serif, SF Pro, Arial`;
				canvasContext.fillStyle = textColor;
				canvasContext.fillText("Tab inactive", tabPreviewWidth / 2, tabPreviewHeight / 2);
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
