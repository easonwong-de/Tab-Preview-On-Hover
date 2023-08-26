document.body.addEventListener("mouseleave", () => {
	browser.runtime.sendMessage("TPOH_ON");
});

document.body.addEventListener("mouseenter", () => {
	browser.runtime.sendMessage("TPOH_OFF");
});
