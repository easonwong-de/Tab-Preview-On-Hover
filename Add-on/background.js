const capture_para = { format: "jpeg", quality: 75, scale: 0.5 };

function update() {
	browser.windows.getAll({ populate: true }).then((windows) => {
		windows.forEach((window) => {
			browser.theme.getCurrent(window.id).then((theme) => {
				let tabs = window.tabs;
				let data = [];
				let cvs_w = 400;
				let cvs_h = 300;
				let tp_h = 200;
				let bg_cl = theme.colors.frame;
				let tt_cl = theme.colors.toolbar_text;
				let tt_mg = 20;
				let tt_sz = 25;
				let tt_sz_s = 20;
				for (let i = 0; i < Math.min(10, tabs.length); i++) {
					let tab = tabs[i];
					// Canvas configs
					let cvs = document.createElement("canvas");
					let ctx = cvs.getContext("2d");
					cvs.width = cvs_w;
					cvs.height = cvs_h;
					// Background
					ctx.fillStyle = bg_cl;
					ctx.fillRect(0, 0, cvs_w, cvs_h);
					ctx.fillStyle = "#000000";
					ctx.fillRect(0, 0, cvs_w, tp_h);
					ctx.fillStyle = "#ffffff33";
					ctx.fillRect(0, tp_h, cvs_w, 2);
					// Info box
					ctx.textAlign = "left";
					ctx.textBaseline = "middle";
					let tt_cl_fd = ctx.createLinearGradient(tt_mg, 0, cvs_w - tt_mg, 0);
					tt_cl_fd.addColorStop(0.9, tt_cl);
					tt_cl_fd.addColorStop(1, "transparent");
					ctx.fillStyle = tt_cl_fd;
					ctx.font = `normal normal 900 ${tt_sz}px apple-system, sans-serif, SF Pro, Arial`;
					ctx.fillText(tab.title, tt_mg, tp_h + (cvs_h - tp_h) / 2 - tt_sz_s / 2 - 5);
					ctx.font = `normal normal 100 ${tt_sz_s}px apple-system, sans-serif, SF Pro, Arial`;
					let hn = new URL(tab.url).hostname;
					ctx.fillText(hn === "" ? tab.url : hn, tt_mg, tp_h + (cvs_h - tp_h) / 2 + tt_sz / 2 + 5);
					// Preview box
					let promise = new Promise((resolve) => {
						if (tab.status == "complete" && !tab.discarded) {
							let tp = new Image();
							tp.onload = () => {
								let tp_raw_ar = tp.width / tp.height;
								let tp_ar = cvs_w / tp_h;
								if (tp_raw_ar > tp_ar)
									ctx.drawImage(tp, (tp.width - tp.height * tp_ar) / 2, 0, tp.height * tp_ar, tp.height, 0, 0, cvs_w, tp_h);
								else ctx.drawImage(tp, 0, 0, tp.width, tp.width / tp_ar, 0, 0, cvs_w, tp_h);

								resolve(cvs.toDataURL("image/jpeg"));
								cvs.remove();
							};
							browser.tabs.captureTab(tab.id, capture_para).then((tp_raw) => (tp.src = tp_raw));
						} else {
							// Placeholder text
							ctx.textAlign = "center";
							ctx.textBaseline = "middle";
							ctx.font = `50px apple-system, sans-serif, SF Pro, Arial`;
							ctx.fillStyle = tt_cl;
							ctx.fillText("Tab inactive", cvs_w / 2, tp_h / 2);
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

setInterval(update, 2500);
