(() => {
  "use strict";
  const root = document.getElementById("nc-ch4-binary-demo");
  if (!root) return;
  const slider = root.querySelector("#nc-ch4-error");
  const valueEl = root.querySelector("#nc-ch4-error-value");
  const noiseEl = root.querySelector("#nc-ch4-noise-entropy");
  const infoEl = root.querySelector("#nc-ch4-mutual-info");
  const chart = root.querySelector("#nc-ch4-info-chart");
  const explanation = root.querySelector("#nc-ch4-interpretation");
  const h = (p) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
  const W = 620, L = 66, R = 590, T = 17, B = 214;
  const x = (p) => L + p * (R - L) / 0.5;
  const y = (v) => B - v * (B - T);
  const round = (v) => v.toFixed(2);
  const path = (fun) => {
    let out = "";
    for (let k = 0; k <= 200; k++) {
      const p = 0.5 * k / 200;
      out += (k ? "L" : "M") + round(x(p)) + "," + round(y(fun(p)));
    }
    return out;
  };
  function render() {
    const p = Number(slider.value);
    if (!Number.isFinite(p) || p < 0 || p > 0.5) return;
    const noise = h(p), info = 1 - noise;
    valueEl.textContent = Math.round(p * 100) + "%";
    noiseEl.textContent = noise.toFixed(3) + " bits";
    infoEl.textContent = info.toFixed(3) + " bits";
    const parts = ['<title>Binary symmetric channel: error rate, noise entropy, and mutual information</title>'];
    [0, 0.25, 0.5, 0.75, 1].forEach(v => {
      const yy = round(y(v));
      parts.push('<line class="nc-ch4-grid" x1="' + L + '" x2="' + R + '" y1="' + yy + '" y2="' + yy + '"/>');
      parts.push('<text class="nc-ch4-tick" x="' + (L - 10) + '" y="' + round(y(v) + 4) + '" text-anchor="end">' + v + '</text>');
    });
    [0, 0.1, 0.2, 0.3, 0.4, 0.5].forEach(v => {
      parts.push('<text class="nc-ch4-tick" x="' + round(x(v)) + '" y="' + (B + 18) + '" text-anchor="middle">' + Math.round(v * 100) + '</text>');
    });
    parts.push('<path class="nc-ch4-curve nc-ch4-noise" d="' + path(h) + '"/>');
    parts.push('<path class="nc-ch4-curve nc-ch4-info" d="' + path(v => 1 - h(v)) + '"/>');
    parts.push('<line class="nc-ch4-guide" x1="' + round(x(p)) + '" x2="' + round(x(p)) + '" y1="' + T + '" y2="' + B + '"/>');
    parts.push('<circle class="nc-ch4-dot-noise" cx="' + round(x(p)) + '" cy="' + round(y(noise)) + '" r="6"/>');
    parts.push('<circle class="nc-ch4-dot-info" cx="' + round(x(p)) + '" cy="' + round(y(info)) + '" r="6"/>');
    parts.push('<text class="nc-ch4-axis" x="' + (L + R) / 2 + '" y="257" text-anchor="middle">Error probability (%)</text>');
    parts.push('<text class="nc-ch4-axis" x="14" y="13">bits</text>');
    chart.innerHTML = parts.join("");
    if (p === 0) explanation.textContent = "오류가 없다. 반응이 자극을 완벽하게 식별하므로 1 bit를 전달한다.";
    else if (p === 0.5) explanation.textContent = "완전한 무작위 반응이다. 반응 entropy는 여전히 1 bit지만, 자극에 대한 정보는 0 bit다.";
    else explanation.textContent = "반응의 전체 entropy는 1 bit로 일정하지만, 오류가 증가하면서 noise entropy가 커지고 stimulus와 response 사이의 정보량은 감소한다.";
  }
  slider.addEventListener("input", render);
  render();
})();