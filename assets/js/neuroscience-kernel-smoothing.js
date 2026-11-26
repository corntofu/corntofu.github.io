(() => {
  "use strict";

  const demo = document.getElementById("nc-kernel-demo");
  if (!demo) return;

  const slider = demo.querySelector("#nc-kernel-bandwidth");
  const output = demo.querySelector("#nc-kernel-bandwidth-value");
  const kernelPlot = demo.querySelector("#nc-kernel-shape");
  const ratePlot = demo.querySelector("#nc-kernel-rate");
  const insight = demo.querySelector("#nc-kernel-insight");
  const peakOutput = demo.querySelector("#nc-kernel-peak");
  const spikes = [100, 135, 170, 385, 403, 430, 462, 710, 764, 800, 835];
  const rootTwoPi = Math.sqrt(2 * Math.PI);
  const plot = { left: 56, right: 606, top: 15, bottom: 185 };

  function gaussian(deltaMs, bandwidthMs) {
    const z = deltaMs / bandwidthMs;
    return (1000 / (rootTwoPi * bandwidthMs)) * Math.exp(-0.5 * z * z);
  }

  function makePlot(svg, options) {
    const { xMin, xMax, yMax, xTicks, yTicks, curve, color, label, spikeMarks } = options;
    const xPixel = (x) => plot.left + ((x - xMin) / (xMax - xMin)) * (plot.right - plot.left);
    const yPixel = (y) => plot.bottom - (Math.min(yMax, Math.max(0, y)) / yMax) * (plot.bottom - plot.top);
    const fixed = (x) => x.toFixed(2);
    const parts = [
      '<title>' + label + '</title>',
      '<desc>Slider를 움직이면 동일한 스파이크 데이터에 적용되는 Gaussian bandwidth가 변합니다.</desc>'
    ];

    yTicks.forEach((tick) => {
      const y = fixed(yPixel(tick));
      parts.push('<line class="nc-kernel-grid" x1="' + plot.left + '" x2="' + plot.right + '" y1="' + y + '" y2="' + y + '"/>');
      parts.push('<text class="nc-kernel-tick" x="47" y="' + fixed(yPixel(tick) + 4) + '" text-anchor="end">' + tick + '</text>');
    });
    xTicks.forEach((tick) => {
      const x = fixed(xPixel(tick));
      parts.push('<line class="nc-kernel-grid nc-kernel-grid-vertical" x1="' + x + '" x2="' + x + '" y1="' + plot.top + '" y2="' + plot.bottom + '"/>');
      parts.push('<text class="nc-kernel-tick" x="' + x + '" y="226" text-anchor="middle">' + tick + '</text>');
    });

    const points = [];
    for (let i = 0; i <= 480; i++) {
      const x = xMin + (i / 480) * (xMax - xMin);
      points.push((i === 0 ? "M" : "L") + fixed(xPixel(x)) + "," + fixed(yPixel(curve(x))));
    }
    parts.push('<path class="nc-kernel-curve" d="' + points.join(" ") + '" stroke="' + color + '"/>');
    parts.push('<line class="nc-kernel-baseline" x1="' + plot.left + '" x2="' + plot.right + '" y1="' + plot.bottom + '" y2="' + plot.bottom + '"/>');
    if (spikeMarks) {
      spikeMarks.forEach((t) => {
        const x = fixed(xPixel(t));
        parts.push('<line class="nc-kernel-raster" x1="' + x + '" x2="' + x + '" y1="191" y2="207"/>');
      });
      parts.push('<text class="nc-kernel-axis-title" x="59" y="239">Spike times (raster marks)</text>');
    } else {
      parts.push('<text class="nc-kernel-axis-title" x="59" y="239">Lag relative to spike (ms)</text>');
    }
    parts.push('<text class="nc-kernel-axis-title" x="58" y="11">Hz</text>');
    svg.innerHTML = parts.join("");
  }

  function render() {
    const h = Number(slider.value);
    if (!Number.isFinite(h) || h <= 0) return;
    output.textContent = h + " ms";
    const peak = gaussian(0, h);
    peakOutput.textContent = peak.toFixed(1) + " Hz";
    makePlot(kernelPlot, {
      xMin: -240, xMax: 240, yMax: 45,
      xTicks: [-200, -100, 0, 100, 200],
      yTicks: [0, 10, 20, 30, 40],
      curve: (x) => gaussian(x, h),
      color: "#8162d6",
      label: "Gaussian kernel shape for bandwidth " + h + " milliseconds"
    });
    makePlot(ratePlot, {
      xMin: 0, xMax: 1000, yMax: 90,
      xTicks: [0, 250, 500, 750, 1000],
      yTicks: [0, 30, 60, 90],
      curve: (t) => spikes.reduce((sum, s) => sum + gaussian(t - s, h), 0),
      color: "#0d9488",
      label: "Smoothed firing rate for bandwidth " + h + " milliseconds",
      spikeMarks: spikes
    });
    if (h <= 30) {
      insight.textContent = "작은 h: 각 스파이크의 영향이 좁고 높습니다. 발화 시각의 세부 구조는 잘 보이지만 곡선이 크게 요동합니다.";
    } else if (h >= 115) {
      insight.textContent = "큰 h: kernel이 넓고 낮아져 인접한 스파이크 군집이 하나로 합쳐집니다. 곡선은 안정적이지만 빠른 변화는 사라집니다.";
    } else {
      insight.textContent = "중간 h: 가까운 스파이크들이 함께 기여하면서 군집별 rate peak가 나타납니다. 시간 해상도와 평활화 정도 사이의 절충입니다.";
    }
  }

  slider.addEventListener("input", render);
  render();
})();