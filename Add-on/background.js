const capture_para = { format: "jpeg", quality: 75, scale: 0.5 };

function update() {
	browser.windows.getAll({ populate: true }).then((windows) => {
		windows.forEach((window) => {
			browser.theme.getCurrent(window.id).then((theme) => {
				let tabs = window.tabs;
				let data = [];
				let cvs_width = 400;
				let cvs_height = 300;
				let tp_height = 200;
				let bg_color = theme.colors.frame;
				let text_color = theme.colors.toolbar_text;
				let text_margin = 20;
				let text_size = 25;
				for (let i = 0; i < Math.min(10, tabs.length); i++) {
					let tab = tabs[i];
					// Canvas configs
					let cvs = document.createElement("canvas");
					let ctx = cvs.getContext("2d");
					cvs.width = cvs_width;
					cvs.height = cvs_height;
					// Background
					ctx.fillStyle = bg_color;
					ctx.fillRect(0, 0, cvs_width, cvs_height);
					ctx.fillStyle = "#000000";
					ctx.fillRect(0, 0, cvs_width, tp_height);
					// Info box
					ctx.textAlign = "left";
					ctx.textBaseline = "middle";
					ctx.font = `normal normal 900 ${text_size}px apple-system, sans-serif, SF Pro, Arial`;
					let text_color_fade = ctx.createLinearGradient(text_margin, 0, cvs_width - text_margin, 0);
					text_color_fade.addColorStop(0.9, text_color);
					text_color_fade.addColorStop(1, "transparent");
					ctx.fillStyle = text_color_fade;
					ctx.fillText(tab.title, text_margin, tp_height + (cvs_height - tp_height) / 2);
					// Preview box
					let promise = new Promise((resolve) => {
						if (tab.status == "complete" && !tab.discarded) {
							let tp = new Image();
							tp.onload = () => {
								let tp_raw_ar = tp.width / tp.height;
								let tp_ar = cvs_width / tp_height;
								if (tp_raw_ar > tp_ar)
									ctx.drawImage(
										tp,
										(tp.width - tp.height * tp_ar) / 2,
										0,
										tp.height * tp_ar,
										tp.height,
										0,
										0,
										cvs_width,
										tp_height
									);
								else ctx.drawImage(tp, 0, 0, tp.width, tp.width / tp_ar, 0, 0, cvs_width, tp_height);

								resolve(cvs.toDataURL("image/jpeg"));
								cvs.remove();
							};
							browser.tabs.captureTab(tab.id, capture_para).then((tp_raw) => (tp.src = tp_raw));
						} else {
							// Placeholder text
							ctx.textAlign = "center";
							ctx.textBaseline = "middle";
							ctx.font = `50px apple-system, sans-serif, SF Pro, Arial`;
							ctx.fillStyle = text_color;
							ctx.fillText("N/A", cvs_width / 2, tp_height / 2);
							resolve(cvs.toDataURL("image/jpeg"));
							cvs.remove();
						}
					});
					data.push(promise);
				}
				Promise.all(data).then((data) => {
					theme.images = { additional_backgrounds: data };
					browser.theme.update(window.id, theme);
				});
			});
		});
	});
}

browser.runtime.onInstalled.addListener(update);

setInterval(update, 2000);
