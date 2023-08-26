document.body.addEventListener("mouseleave", () => {
	browser.runtime.sendMessage("UPDATE_ON");
});

document.body.addEventListener("mouseenter", () => {
	browser.runtime.sendMessage("UPDATE_OFF");
});
