document.body.addEventListener("mouseleave", () => {
	browser.runtime.sendMessage("Mouse leaves", Date.now());
});

document.body.addEventListener("mouseenter", () => {
	browser.runtime.sendMessage("Mouse enters", Date.now());
});
