---
layout: post
math: true
title: "Dayan & Abbott Chapter 1 — Neural Encoding I: Firing Rates and Spike Statistics"
date: 2026-11-26 00:01:00 +0900
description: "스파이크열의 수학적 표현에서 firing rate, kernel smoothing, tuning curve, spike-triggered average, Poisson process와 neural coding까지 정리한다."
tags: computational-neuroscience
categories: Computational Neuroscience
---

*Dayan & Abbott, Theoretical Neuroscience*, Chapter 1의 핵심은 **스파이크가 어떻게 생성되는가**보다 **관측된 스파이크열을 어떻게 수학적으로 표현하고, 자극에 대한 반응을 통계적으로 설명할 것인가**에 있다. 활동전위를 생성하는 막전위 동역학은 뒤의 장에서 다룬다.

이 장의 논리적 흐름을 먼저 정리하면 다음과 같다.

$$
\boxed{
\text{Stimulus }s(t)
\;\longrightarrow\;
\text{Firing rate }r(t)
\;\longrightarrow\;
\text{Stochastic spike train }\rho(t)
}
$$

반대로 실험 데이터에서는 관측한 스파이크열 $\rho(t)$에서 firing rate와 자극에 대한 선택성, 시간적 상관을 추정한다.

---

## 1. Spike train을 함수로 표현하기

뉴런의 활동전위는 파형의 모양보다 **발생 시각**이 정보 분석에서 중요한 경우가 많다. 스파이크가 $t_1,\ldots,t_N$에 발생했다면 이를 디랙 델타 함수의 합으로 표현한다.

$$
\boxed{
\rho(t)=\sum_{i=1}^{N}\delta(t-t_i)
}
$$

이것을 *neural response function*이라 한다. $\rho(t)$는 일반적인 의미의 매끄러운 함수가 아니라, 각 스파이크 위치에 질량이 1인 델타가 놓인 표현이다.

예를 들어 관측 구간 $[a,b]$ 안의 스파이크 수는 경계에 정확히 놓인 스파이크를 별도로 처리하면

$$
N_{[a,b]}=\int_a^b\rho(t)\,dt
$$

로 계산할 수 있다.

이 표현의 장점은 개별 스파이크에 대한 합을 적분 또는 convolution으로 다룰 수 있다는 것이다.

$$
\int_{-\infty}^{\infty}h(t-\tau)\rho(\tau)\,d\tau
=\sum_i h(t-t_i).
$$

즉, **이산적인 발생 시각을 연속시간 신호처리와 연결**할 수 있다.

---

## 2. Firing rate: 정확히 무엇을 평균하는가?

같은 자극을 반복해서 제시해도 매번 정확히 같은 스파이크가 발생하지는 않는다. 따라서 뉴런 반응을 하나의 결정론적 spike train보다 **확률적 반응**으로 기술한다.

---

### 2.1 시간 의존 firing rate

충분히 작은 시간폭 $\Delta t$에서

$$
P\bigl(N_{[t,t+\Delta t]}\ge1\mid s\bigr)
=r(t\mid s)\Delta t+o(\Delta t)
$$

로 놓는다. 여기서 $r(t\mid s)$는 자극 $s$가 주어졌을 때의 순간적인 스파이크 발생률이다. 단위는 $\mathrm{s}^{-1}=\mathrm{Hz}$다.

같은 자극에 대해 여러 trial을 반복한다면 형식적으로

$$
\boxed{r(t\mid s)=\langle\rho(t)\rangle_{\mathrm{trials}}}
$$

라고 쓸 수 있다. 오른쪽은 델타 함수의 ensemble 평균이므로 적분의 의미로 해석한다.

---

### 2.2 Spike-count rate

하나의 trial에서 길이 $T$ 동안 $N$개의 스파이크를 기록했다면

$$
\boxed{r_{\mathrm{count}}=\frac NT}.
$$

이 값은 전체 발화량을 요약하지만 **언제 발화했는지**는 잃는다. 예를 들어 두 neuron이 모두 1초에 20번 발화했다고 해도, 한 neuron은 초반에 몰아서 발화하고 다른 neuron은 고르게 발화할 수 있다.

여러 trial에 걸쳐 평균하면

$$
\mathbb E[r_{\mathrm{count}}]
=\frac{\mathbb E[N]}T
=\frac1T\int_0^T r(t)\,dt.
$$

따라서 구분해야 하는 대상은 다음 세 가지다.

| 기호 | 의미 |
| --- | --- |
| $\rho(t)$ | 실제 관측한 spike train |
| $r(t)$ | 반복 시행에 대한 순간적 평균 발화율 |
| $r_{\mathrm{count}}=N/T$ | 단일 시행의 시간 평균 발화량 |

> **핵심:** 한 trial에서 관측한 $\rho(t)$와 우리가 알고 싶은 잠재적인 $r(t)$는 같은 것이 아니다. $r(t)$는 관측으로부터 *추정*해야 한다.

---

### 2.3 $\langle\,\cdot\,\rangle$는 무슨 뜻인가?

책에 반복해서 나오는 **angle brackets(꺾쇠괄호)**

$$
\boxed{\langle X\rangle}
$$

는 여기서는 보통 **평균(average)** 또는 **기댓값(expectation)**을 뜻한다. 단순히 $X$를 감싸는 괄호가 아니라, 어떤 기준으로 평균하는지가 중요하다. 아래첨자를 통해 그 기준을 명시할 수 있다.

**(1) Ensemble average — 반복 trial에 대한 평균**

같은 자극을 $M$번 제시하고 $k$번째 trial의 spike train을 $\rho_k(t)$라 하자.

$$
\langle \rho(t)\rangle_{\mathrm{trials}}
=\lim_{M\to\infty}\frac1M\sum_{k=1}^{M}\rho_k(t)
=r(t).
$$

즉 **동일한 시각 $t$에서 여러 시행의 반응을 평균**한다. 각 trial의 델타 함수가 합쳐지므로 위 식은 일반적인 점별 함수 등식보다는 분포(distribution) 또는 작은 시간 bin을 이용한 평균의 의미로 이해한다. 실제 실험에서는 유한한 trial 수를 사용해 추정한다.

**(2) Time average — 한 기록을 시간에 따라 평균**

시간에 따른 rate $r(t)$의 관측 구간 평균은

$$
\boxed{
\langle r\rangle_t
=\frac1T\int_0^T r(t)\,dt
}.
$$

반면 **한 trial**의 spike train을 시간 평균하면

$$
\langle\rho\rangle_t
=\frac1T\int_0^T\rho(t)\,dt
=\frac NT
=r_{\mathrm{count}}
$$

가 된다(관측 구간 내부에 있는 스파이크를 센다).

**(3) 두 종류의 평균을 혼동하지 말 것**

$$
\underbrace{\langle\rho(t)\rangle_{\mathrm{trials}}}_{\text{고정한 }t\text{에서 여러 시행 평균}}
=r(t),
\qquad
\underbrace{\langle r\rangle_t}_{\text{시간에 따른 평균}}
=\frac1T\int_0^T r(t)\,dt.
$$

첫 번째 결과는 **시간의 함수**이고, 두 번째는 **숫자 하나**다. 동일한 값이라고 생각하면 안 된다. 같은 시간 구간에 대해 ensemble 평균과 시간 적분을 교환하면 $\mathbb E[N/T]=(1/T)\int_0^T r(t)\,dt$라는 관계를 얻지만, **한 trial의 시간 평균**이 언제나 ensemble 평균과 같다는 뜻은 아니다. (정상성과 에르고딕성 등 추가 조건 아래 긴 시간 평균으로 ensemble 평균을 추정할 수 있는 상황이 있다.)

> **표기법 기억하기:** $\langle X\rangle$는 '무엇을 평균하는지'뿐 아니라 '**어떤 축에서 평균하는지**'를 함께 보자. 이 장에서는 특히 $\langle\cdot\rangle_{\mathrm{trials}}$와 $\langle\cdot\rangle_t$를 구분하면 된다. 다른 분야에서는 $\langle\cdot,\cdot\rangle$가 내적을 뜻하기도 하지만, 여기서 $\langle \rho(t)\rangle$는 내적이 아니다.

---

## 3. Kernel smoothing: 스파이크를 연속적인 rate로 바꾸기

단일 spike train의 델타 함수는 매우 불연속적이다. 특정 시각 $t$의 근처에 발생한 스파이크들을 **시간 거리에 따라 가중합**하면 연속적인 rate 추정값을 만들 수 있다.

$$
\boxed{
\hat r(t)=\sum_{i=1}^{N}K_h(t-t_i)
}
$$

여기서 $K_h$는 kernel, $h$는 bandwidth이다. 일반적으로 다음처럼 정규화한다.

$$
K_h(u)=\frac1h K\left(\frac uh\right),
\qquad
\int_{-\infty}^{\infty}K(u)\,du=1.
$$

그러면 관측 구간의 양끝에서 잘리는 부분을 무시할 때

$$
\int_{-\infty}^{\infty}\hat r(t)\,dt=N.
$$

즉 spike 하나가 총 spike count에 1만큼 기여하고, $\hat r(t)$의 단위는 Hz가 된다. 별도로 $N$으로 나누는 일반적인 확률밀도 추정(KDE)과는 정규화가 다르다.

---

### 3.1 Gaussian kernel의 직관

$$
\boxed{
K_h(u)=\frac{1}{\sqrt{2\pi}h}
\exp\left(-\frac{u^2}{2h^2}\right)
}
$$

이 kernel을 사용하면 $t$와 가까운 시각 $t_i$의 스파이크일수록 더 큰 값을 더한다.

- $|t-t_i|$가 작으면 해당 스파이크의 기여도가 크다.
- $|t-t_i|$가 크면 해당 스파이크의 기여도가 작다.
- $t$를 연속적으로 옮겨 가며 같은 계산을 하면 매끄러운 곡선이 된다.

이 연산은 델타 함수 표현을 이용하면 곧 convolution이다.

$$
\begin{aligned}
\hat r(t)
&=\sum_i K_h(t-t_i)\\
&=\int K_h(t-\tau)\rho(\tau)\,d\tau\\
&=\boxed{(K_h*\rho)(t)}.
\end{aligned}
$$

신호처리 관점에서는 spike train에 smoothing filter를 적용하는 것과 같다.

---

### 3.2 Bandwidth와 bias–variance trade-off

| Bandwidth | 장점 | 단점 |
| --- | --- | --- |
| 작은 $h$ | 빠른 시간적 변화를 보존 | 개별 spike에 민감하여 추정값이 요동 |
| 큰 $h$ | 안정적이고 매끄러운 추정 | 가까운 발화 군집이나 빠른 변화를 뭉갬 |

$h$를 키운다고 무조건 정확해지는 것은 아니다. **매끄러움은 정확성과 다르다.** 이상적인 조건에서

$$
\mathbb E[\hat r(t)]=(K_h*r)(t)
$$

이므로, kernel smoothing은 실제 rate 자체가 아니라 **실제 rate를 kernel로 흐리게 만든 값**을 평균적으로 추정한다. 이것이 smoothing bias의 원인이다.

---

### 3.3 직접 실험: Gaussian bandwidth $h$를 바꿔 보기

이 실험은 **11개의 고정된 spike 발생 시각**을 사용한다. 슬라이더의 $h$를 바꾸면 두 그래프가 동시에 갱신된다. 왼쪽은 정규화된 Gaussian kernel $K_h(u)$, 오른쪽은 동일한 kernel을 spike마다 더한 $\hat r(t)=\sum_iK_h(t-t_i)$다. 오른쪽 아래 주황색 짧은 선들이 실제 spike의 발생 시각이다.

<link rel="stylesheet" href="{{ '/assets/css/neuroscience-kernel-smoothing.css' | relative_url }}">

<div id="nc-kernel-demo" class="nc-kernel-demo">
  <p class="nc-kernel-heading">Interactive · Gaussian kernel smoothing</p>
  <p class="nc-kernel-intro">Bandwidth를 조절하며 kernel의 폭과 smoothed firing rate의 변화를 비교하자. 그래프 축은 비교를 위해 고정되어 있다.</p>
  <div class="nc-kernel-controls">
    <label for="nc-kernel-bandwidth">Bandwidth <i>h</i></label>
    <output id="nc-kernel-bandwidth-value" for="nc-kernel-bandwidth">45 ms</output>
  </div>
  <input id="nc-kernel-bandwidth" type="range" min="10" max="180" value="45" step="5" aria-describedby="nc-kernel-insight">
  <div class="nc-kernel-limits"><span>10 ms · 세밀한 시간 구조</span><span>180 ms · 강한 smoothing</span></div>
  <div class="nc-kernel-charts">
    <div class="nc-kernel-chart">
      <h4>① Gaussian kernel의 모양</h4>
      <p>넓어질수록 높이는 낮아지지만 면적은 1로 일정하다.</p>
      <svg id="nc-kernel-shape" viewBox="0 0 620 245" role="img" aria-label="Gaussian kernel shape depending on bandwidth"></svg>
    </div>
    <div class="nc-kernel-chart">
      <h4>② Spike train의 smoothing 결과</h4>
      <p>동일한 11개 spike에 각 kernel을 적용한 결과다.</p>
      <svg id="nc-kernel-rate" viewBox="0 0 620 245" role="img" aria-label="Smoothed spike firing rate depending on bandwidth"></svg>
    </div>
  </div>
  <div class="nc-kernel-summary">
    <span class="nc-kernel-metric">Spike 수: <strong>11</strong></span>
    <span class="nc-kernel-metric">Kernel의 최대 높이: <strong id="nc-kernel-peak">8.9 Hz</strong></span>
    <span class="nc-kernel-metric">관측 구간: <strong>1 s</strong></span>
  </div>
  <p id="nc-kernel-insight" class="nc-kernel-insight" aria-live="polite">슬라이더를 움직여 bandwidth의 효과를 확인한다.</p>
  <p class="nc-kernel-footnote">실제 실험 데이터가 아닌 고정된 예제다. 관측구간 밖에도 Gaussian kernel의 꼬리가 이어질 수 있으며, 이 그래프는 숨겨진 실제 rate가 아니라 추정량을 보여준다.</p>
  <noscript><p>이 시각화를 사용하려면 JavaScript가 필요하다.</p></noscript>
</div>

<script defer src="{{ '/assets/js/neuroscience-kernel-smoothing.js' | relative_url }}"></script>

**관찰할 점:** $h$가 작으면 spike에 가까운 부분에 좁고 높은 peak가 생기고, $h$가 커지면 여러 peak가 겹쳐 넓은 봉우리가 된다. 전체 시간축에서 적분한 추정 firing rate는 항상 spike 수인 11이 된다.

---

### 3.4 Causal kernel이 필요한 이유

Gaussian kernel은 시각 $t$에서 $t$ **이후**에 발생한 spike도 사용한다. 사후 분석에는 괜찮지만 실시간 decoding에는 맞지 않는다.

한 가지 causal kernel은 다음과 같은 alpha function이다.

$$
K(u)=
\begin{cases}
\alpha^2 u e^{-\alpha u},&u\ge0,\\
0,&u<0.
\end{cases}
$$

$\hat r(t)=\sum_i K(t-t_i)$에서 $t_i>t$이면 $K(t-t_i)=0$이므로 미래 spike를 참조하지 않는다. 실시간 BCI에서는 이런 인과성과 smoothing에 따른 지연을 함께 고려해야 한다.

---

## 4. Tuning curve: 자극의 어떤 속성에 반응하는가?

자극의 특징 $s$를 바꾸면서 평균 발화율을 측정한 함수를 **tuning curve**라 한다.

$$
\boxed{
f(s)=\mathbb E[r_{\mathrm{count}}\mid s]
}
$$

예를 들어 시각피질 뉴런이 선분의 방향에 선택적으로 반응한다면 국소적으로 Gaussian 형태의 tuning curve를 사용할 수 있다.

$$
f(s)=r_{\max}
\exp\left[
-\frac12\left(\frac{s-s_{\mathrm{pref}}}{\sigma}\right)^2
\right].
$$

여기서 $s_{\mathrm{pref}}$는 선호 방향, $\sigma$는 반응 폭이다. 방향이 주기적인 변수라는 점까지 모델링할 때는 원형 변수에 맞는 tuning 함수를 사용해야 한다.

하지만 평균 반응 $f(s)$를 아는 것만으로는 매 trial의 결과를 예측할 수 없다. 동일한 $s$에서도 spike count가 달라지기 때문이다.

$$
f(s)\quad\text{뿐 아니라}\quad P(N\mid s)
$$

혹은 전체 spike train에 대한 $P(t_1,\ldots,t_N\mid s)$가 필요하다. 이것이 spike statistics가 등장하는 이유다.

---

## 5. Spike-triggered average: 스파이크 직전에는 어떤 자극이 있었는가?

Tuning curve는 **자극을 기준으로 반응을 평균**한다. Spike-triggered average(STA)는 반대로 **spike를 기준으로 그 이전 자극을 평균**한다.

시간 $t_i$에 spike가 발생했다면 $\tau$만큼 이전의 자극은 $s(t_i-\tau)$다. 따라서

$$
\boxed{
\mathrm{STA}(\tau)
=\frac1{N_{\mathrm{spikes}}}
\sum_i s(t_i-\tau)
}
$$

로 정의한다. 실험에 따라 stimulus baseline을 제거한 뒤 평균하기도 한다.

가령 $\tau=20\,\mathrm{ms}$ 근처에서 STA가 크게 양수라면, spike가 발생하기 약 20 ms 전에 자극이 평균적으로 높았다는 뜻이다.

---

### 5.1 Spike 평균은 왜 시간 적분으로 바뀌는가?

정의에서 시작하자. $N>0$개의 spike가 $t_1,\ldots,t_N$에 발생했다고 하면

$$
\mathrm{STA}_{\mathrm{obs}}(\tau)=\frac1N\sum_i s(t_i-\tau)
$$

이다. $\rho(t)=\sum_i\delta(t-t_i)$를 대입하면 delta 함수의 성질에 의해

$$
\begin{aligned}
\int_0^T s(t-\tau)\rho(t)\,dt
&=\int_0^T s(t-\tau)\sum_i\delta(t-t_i)\,dt\\
&=\sum_i s(t_i-\tau).
\end{aligned}
$$

따라서 (분석할 스파이크와 그 이전 자극을 충분히 기록했다면)

$$
\boxed{
\mathrm{STA}_{\mathrm{obs}}(\tau)
=\frac1N\int_0^T s(t-\tau)\rho(t)\,dt
}.
$$

**여기에는 근사가 없다.** Delta 함수가 $t_i$에서의 자극값만 선택했기 때문이다. $\tau>0$에 대해 $s(t-\tau)$로 쓰는 것은 spike 발생 시점의 **이전 자극**을 보기 위해서다.

---

### 5.2 시간 평균으로 나누면 cross-correlation이 된다

위 식의 분자와 분모를 $T$로 나누자.

$$
\begin{aligned}
\mathrm{STA}_{\mathrm{obs}}(\tau)
&=\frac{\frac1T\int_0^T s(t-\tau)\rho(t)\,dt}{N/T}\\
&=\boxed{
\frac{\langle s(t-\tau)\rho(t)\rangle_{t,T}}
{\langle \rho\rangle_{t,T}}
}.
\end{aligned}
$$

여기서 $\langle X\rangle_{t,T}:=T^{-1}\int_0^T X(t)\,dt$는 **유한 구간 시간 평균**이며 $\langle\rho\rangle_{t,T}=N/T$다. 이 비율식도 정확하다. 즉 기존에 표시한 $\approx$의 근거가 단순히 '합을 적분으로 바꾼다'는 것은 아니다.

이제 **관측한 스파이크** $\rho$ 대신 **기대 발화율** $r$를 연결한다. Stimulus $s$가 주어졌을 때

$$
\mathbb E[\rho(t)\mid s]=r(t\mid s)
$$

이고, 따라서

$$
\mathbb E[s(t-\tau)\rho(t)\mid s]
=s(t-\tau)r(t\mid s).
$$

많은 반복 시행 또는 적절한 정상성·에르고딕성 조건에서 긴 기록을 사용하면 관측한 spike–stimulus 평균을 이 기대값에 가까운 rate–stimulus 평균으로 추정할 수 있다. **유한 표본의 비율을 기대값의 비율로 바꾸는 것은 일반적으로 근사**라는 점을 주의하자.

책에서 사용하는 cross-correlation의 한 표기법을

$$
Q_{rs}(\ell)=\frac1T\int_0^T r(t)s(t+\ell)\,dt
$$

로 정의하고 $\bar r=T^{-1}\int_0^T r(t)\,dt$라 놓으면

$$
\boxed{
\mathrm{STA}(\tau)\approx\frac{Q_{rs}(-\tau)}{\bar r}
}.
$$

**왜 $-\tau$인가?** $Q_{rs}(\ell)$는 시각 $t+\ell$의 stimulus를 이용하는 반면 STA는 spike 시각 $t$보다 $\tau$만큼 앞선 $t-\tau$를 사용하기 때문이다. 즉 $\ell=-\tau$다.

> **정리:** Spike 합 $\to$ delta 적분 $\to$ 관측 시간 평균의 비율은 정확한 변형이다. $\rho(t)$를 확률적 평균 $r(t)$로 바꾸고 유한 표본을 ensemble average로 추정하는 지점에서 통계적 근사와 조건이 필요하다.

---

### 5.3 White noise stimulus와 선형 receptive field

자극 자체에 시간 상관이 크면 STA에는 뉴런의 반응 특성과 자극의 autocorrelation이 섞인다. 이를 간단한 선형 근사로 확인해 보자.

$$
r(t)=r_0+\int_0^\infty k(u)s(t-u)\,du.
$$

여기서 $k(u)$는 stimulus에 대한 causal temporal filter다. 이 식은 rate가 음수가 되지 않는 범위에서의 선형 근사로 생각한다. 자극 $s(t)$가 평균이 0이고 white noise라면

$$
\mathbb E[s(t)]=0,\qquad
\mathbb E[s(t-\tau)s(t-u)]=\sigma_s^2\delta(\tau-u)
$$

이다. 따라서

$$
\begin{aligned}
\mathbb E[s(t-\tau)r(t)]
&=r_0\mathbb E[s(t-\tau)]\\
&\quad+\int_0^\infty k(u)\mathbb E[s(t-\tau)s(t-u)]\,du\\
&=\sigma_s^2 k(\tau)\qquad(\tau>0).
\end{aligned}
$$

또한 $\bar r=r_0$이므로

$$
\boxed{\mathrm{STA}(\tau)\approx\frac{\sigma_s^2}{r_0}k(\tau)}.
$$

따라서 **white-noise stimulus와 선형 근사가 맞는 경우 STA는 뉴런의 시간적 필터 $k(\tau)$에 비례**한다. 반면 colored noise를 쓰면 stimulus autocorrelation이 $k$에 convolution된 모양이 나오므로 STA를 곧바로 receptive field라고 해석하면 안 된다. 실제 뉴런의 비선형성과 stimulus 분포에 따라 추가적인 보정이 필요할 수 있다.

---

## 6. Poisson process: 왜 등장하는가?

뉴런의 모든 가능한 스파이크 시각 조합에 확률을 부여하는 것은 복잡하다. 가장 단순한 시작점은 다음 가정이다.

1. 작은 시간 구간 $\Delta t$에 spike가 발생할 확률은 약 $r\Delta t$이다.
2. 서로 겹치지 않는 시간 구간의 spike 발생은 독립이다.
3. $\Delta t$가 충분히 짧아 하나의 구간에서 두 개 이상의 spike가 발생할 확률은 더 작은 차수다.

$firing\ rate$가 일정할 때 이 가정이 **homogeneous Poisson process**로 이어진다.

---

### 6.1 Binomial에서 Poisson으로: 직접 유도

전체 길이 $T$를 폭 $\Delta t$의 작은 구간으로 나누면 구간 수는

$$
n=\frac{T}{\Delta t}
$$

이고 각 구간의 spike 발생 확률은

$$
p=r\Delta t
$$

이다. 독립적인 Bernoulli 시행이라는 가정 아래 spike count $N$은

$$
N\sim\operatorname{Binomial}(n,p)
$$

를 따른다.

이제 $\Delta t\to0$으로 보내면

$$
n\to\infty,\qquad p\to0,\qquad
np=\frac{T}{\Delta t}r\Delta t=rT=\lambda
$$

이다. 따라서 고전적인 rare-event limit에 의해

$$
\boxed{
P(N=k)=\lim_{\substack{n\to\infty\\p\to0\\np=\lambda}}
\binom nk p^k(1-p)^{n-k}
=\frac{\lambda^k e^{-\lambda}}{k!}
}
$$

가 된다. 즉,

$$
\boxed{N\sim\operatorname{Poisson}(rT)}.
$$

> **주의:** $n$이 크고 $p$가 작다는 사실만으로 뉴런이 Poisson process라는 결론은 나오지 않는다. 시간 구간 사이의 **독립성**이 핵심적인 추가 가정이다. 이 가정은 실제 뉴런의 refractory period 때문에 어긋날 수 있다.

또한 *Poisson distribution*은 구간 안의 **spike 개수**를 나타내고, *Poisson process*는 여러 시간 구간의 count 및 **발생 시각의 구조**까지 정의한다.

---

### 6.2 Poisson spike count의 평균과 분산

$$
\mathbb E[N]=rT,\qquad \operatorname{Var}(N)=rT.
$$

따라서 Fano factor는

$$
\boxed{
F=\frac{\operatorname{Var}(N)}{\mathbb E[N]}=1
}
$$

이다. 흔히 $F<1$은 Poisson보다 규칙적인 count, $F>1$은 더 큰 count variability를 뜻한다.

그러나 **$F=1$이라고 해서 그 과정이 반드시 Poisson인 것은 아니다.**

---

### 6.3 Interspike interval(ISI)

Homogeneous Poisson process에서 다음 spike까지 $\tau$ 동안 아무 spike도 없을 확률은

$$
P(\mathrm{ISI}>\tau)=e^{-r\tau}
$$

이다. 이를 미분하면

$$
\boxed{
p_{\mathrm{ISI}}(\tau)=re^{-r\tau},\qquad \tau\ge0
}
$$

가 나온다.

$$
\mathbb E[\tau]=\frac1r,\qquad
\operatorname{Var}(\tau)=\frac1{r^2}
$$

이므로 coefficient of variation은

$$
\boxed{
CV=\frac{\sqrt{\operatorname{Var}(\tau)}}{\mathbb E[\tau]}=1
}.
$$

가령 평균 발화율 $r=20\,\mathrm{Hz}$라면 평균 ISI는 $50\,\mathrm{ms}$다. 그렇다고 모든 spike가 50 ms마다 규칙적으로 발생하는 것은 아니다.

---

## 7. 실제 뉴런은 왜 완전한 Poisson process가 아닌가?

실제 뉴런은 spike 직후 일정 시간 동안 재발화가 어렵거나 불가능한 **refractory period**를 갖는다. 따라서 직전 spike의 존재가 다음 spike의 확률에 영향을 준다.

Poisson model과 실제 기록을 비교할 때 확인할 항목은 다음과 같다.

| 통계량 | Homogeneous Poisson 예측 | 실제 기록에서 볼 수 있는 현상 |
| --- | --- | --- |
| Spike count | $\operatorname{Var}(N)=\mathbb E[N]$ | 과분산 또는 저분산 |
| Fano factor | $F=1$ | $F>1$ 또는 $F<1$ |
| ISI | 지수분포 | 불응기, burst 등의 영향 |
| ISI의 CV | $CV=1$ | 규칙적 발화에서는 작은 값, burst에서는 큰 값 가능 |
| 시간적 의존성 | 서로 다른 구간의 increment가 독립 | spike history에 따른 의존성 |

Poisson은 생물학적 진실이라기보다는 **간단하고 분석 가능한 기준 모델(null model)**로 이해하는 편이 정확하다.

---

## 8. Inhomogeneous Poisson process

시간에 따라 자극이 바뀌면 발화율도 일정하지 않다. 이런 경우 $r(t)$를 사용하는 **inhomogeneous Poisson process**로 확장한다.

관측 구간 $[0,T]$에서 spike가 순서대로 $t_1<\cdots<t_N$에 발생했다면, 그 ordered spike times에 대한 결합확률밀도는

$$
\boxed{
p(t_1,\ldots,t_N)
=
\exp\left[-\int_0^T r(t)\,dt\right]
\prod_{i=1}^{N}r(t_i)
}
$$

이다.

이 식은 다음 두 요소의 곱으로 해석할 수 있다.

- $\prod_i r(t_i)$: 실제 spike가 발생한 시각에서 발화율이 얼마나 높은가
- $\exp[-\int_0^T r(t)\,dt]$: 관측 구간 전체에서 **추가 spike가 발생하지 않는** 항

따라서 log-likelihood는

$$
\boxed{
\log p
=
\sum_{i=1}^{N}\log r(t_i)
-\int_0^T r(t)\,dt
}
$$

로 간결해진다. 이 구조는 이후 point-process model이나 neural decoding을 위한 모델의 파라미터 추정에도 유용하다.

단, $r(t)$를 쓰는 것만으로 실제 history dependence가 해결되는 것은 아니다. Inhomogeneous Poisson에서도 **주어진 rate 아래에서 서로 겹치지 않는 구간의 count는 독립**이라는 가정이 남는다.

---

## 9. Renewal process와 spike history

**Renewal process**에서는 연속된 ISI가 서로 독립이고 같은 분포를 따른다. 다음 spike까지의 위험도(hazard)는 마지막 spike 이후 경과시간에 의존할 수 있다.

Homogeneous Poisson process는 ISI가 지수분포인 renewal process의 특수한 경우다. 반면 refractory period를 갖는 renewal process는 짧은 ISI를 억제할 수 있다.

핵심 차이는 **시간이 일정한가**보다 **직전 spike 이후의 경과시간이 다음 spike 확률에 영향을 주는가**다.

---

## 10. Correlation으로 보는 시간적 구조

Spike count나 평균 firing rate만으로 놓치는 구조는 correlation을 통해 살필 수 있다.

Autocorrelation은 같은 뉴런의 두 시점 사이 관계를 보고, cross-correlation은 서로 다른 두 뉴런의 시간적 관계를 본다. 평균을 뺀 autocovariance는 다음처럼 쓸 수 있다.

$$
C_{\rho\rho}(\tau)
=\left\langle
[\rho(t)-\bar r][\rho(t+\tau)-\bar r]
\right\rangle.
$$

해석할 때 유의할 점은 다음과 같다.

- 짧은 지연에서 spike pair가 적으면 refractory period를 의심할 수 있다.
- 주기적인 peak는 진동성 발화의 단서가 될 수 있다.
- 두 뉴런의 cross-correlation peak는 동시발화나 지연된 공동 변화를 보여 줄 수 있다.

다만 **상관관계가 곧 직접적인 synaptic connection을 의미하지는 않는다.** 공통 입력으로도 correlation이 생긴다. 또한 $\tau=0$에서 같은 spike가 자신과 짝을 이루는 항은 별도로 해석해야 한다.

---

## 11. Neural code의 구분: rate와 timing을 단순 대립시키지 말자

이 장 후반부에서는 neural code를 여러 기준으로 나누어 생각한다.

---

### Independent-spike vs correlation code

주어진 stimulus에서 spike train의 확률이 $r(t)$만으로 설명되는가? 아니면 개별 spike들 사이의 시간적 관계가 추가 정보를 담는가?

Inhomogeneous Poisson model은 독립적인 spike event로부터 시간에 따른 반응 패턴을 생성하는 기준 예시다.

---

### Independent-neuron vs population correlation code

서로 다른 뉴런들의 조건부 분포가

$$
P(\rho_1,\ldots,\rho_M\mid s)
=\prod_{j=1}^{M}P(\rho_j\mid s)
$$

로 나뉘는가? 그렇지 않다면 뉴런 사이의 상관이 추가 정보를 담을 수 있다.

---

### Rate vs temporal code

단순한 spike count만으로 정보를 읽을 수 있는가? 아니면 millisecond 단위의 spike timing이 중요한가?

여기서 중요한 결론은 다음과 같다.

$$
\boxed{
\text{Precise spike timing}
\;\not\Rightarrow\;
\text{Spike-to-spike dependence}
}
$$

$r(t)$가 매우 빠르게 변하는 inhomogeneous Poisson model에서도 정밀한 시간 패턴이 나타날 수 있다. 따라서 **temporal coding과 correlation coding은 같은 개념이 아니다.**

---

## 12. Chapter 1을 읽으며 정리한 세 가지 질문

---

### Q1. Kernel smoothing은 특정 $t$의 주변 스파이크를 합쳐서 rate를 부드럽게 만드는 것인가?

**그렇다.** 정확히는 주변 spike를 동일하게 세는 것이 아니라, $K_h(t-t_i)$라는 가중치를 부여하여 합산한다.

$$
\hat r(t)=\sum_iK_h(t-t_i).
$$

이 추정량을 여러 시각 $t$에 대해 계산하면 매끄러운 firing-rate 곡선을 얻는다. 그러나 smoothing이 강할수록 실제 빠른 rate 변화를 놓칠 수 있다.

---

### Q2. $n$에 비해 $p$가 작으므로 Poisson을 가정하는 것인가?

**이항분포의 rare-event limit라는 직관은 맞지만, 그것만으로 충분하지 않다.**

$$
n=\frac{T}{\Delta t}\to\infty,\qquad
p=r\Delta t\to0,\qquad
np=rT
$$

이므로 Bernoulli bin들이 독립적이라면 Poisson으로 수렴한다. 실제 뉴런에서는 불응기, bursting, network state가 독립성을 깨뜨릴 수 있다.

---

### Q3. Kernel smoothing과 Poisson model은 같은 종류의 도구인가?

**아니다.** 역할이 다르다.

- **Kernel smoothing:** 관측된 $\rho(t)$에서 $\hat r(t)$를 얻는 **추정 방법**
- **Poisson process:** 주어진 $r(t)$ 아래에서 $\rho(t)$가 확률적으로 어떻게 발생하는지 나타내는 **생성 모델**

둘을 연결하면 다음처럼 양방향으로 이해할 수 있다.

$$
\underbrace{\rho(t)\xrightarrow{\ K_h*\ }\hat r(t)}_{\text{데이터 분석}}
\qquad\qquad
\underbrace{r(t)\xrightarrow{\ \text{Poisson model}\ }\rho(t)}_{\text{확률적 생성}}
$$

이 두 방향을 혼동하지 않는 것이 Chapter 1의 중요한 학습 포인트다.

---

## 13. 연습문제

**Q1.** $T=2\,\mathrm{s}$에서 $r=15\,\mathrm{Hz}$인 homogeneous Poisson process의 평균 spike count, count variance, Fano factor와 평균 ISI를 구하라.

**Q2.** 폭 $h$인 Gaussian kernel을 사용해 spike train을 smoothing할 때, $h$를 지나치게 크게 설정하면 어떤 종류의 정보가 손실되는가?

**Q3.** 다음 두 가정을 구분하라.

1. spike가 매우 짧은 시간 구간에서 드물게 발생한다.
2. 서로 다른 시간 구간의 spike 발생은 독립이다.

Poisson process의 유도에 두 번째 가정이 왜 필요한가?

**Q4.** 시간에 따라 빠르게 변화하는 $r(t)$를 가진 inhomogeneous Poisson model이 정밀한 spike timing을 표현하면서도 independent-spike model일 수 있는 이유를 설명하라.

<details markdown="1">
<summary><strong>정답과 해설</strong></summary>

- **Q1.** $\lambda=rT=30$이므로 평균과 분산은 모두 30, $F=1$, 평균 ISI는 $1/15\,\mathrm{s}\approx66.7\,\mathrm{ms}$다.
- **Q2.** 시간적으로 가까운 발화 군집이나 급격한 firing-rate 변화가 합쳐져 보인다. Variance는 줄더라도 smoothing bias가 증가한다.
- **Q3.** 드문 사건이라는 성질만으로는 시간 구간 간 동시 변동이나 spike history의 영향을 배제할 수 없다. 독립적인 Bernoulli bin이 있어야 이항분포부터 유도할 수 있다.
- **Q4.** 스파이크의 발생확률 $r(t)\Delta t$ 자체는 빠르게 변화할 수 있다. 그러나 그 확률이 주어졌을 때 각 구간의 event는 여전히 독립일 수 있다. 시간 정밀도와 spike 간 의존성은 별개의 문제다.

</details>

---

## 마무리

Chapter 1의 기본 구조는 다음 네 문장으로 압축된다.

1. 스파이크는 발생 시각의 집합이고, $\rho(t)=\sum_i\delta(t-t_i)$로 나타낼 수 있다.
2. 관측한 spike train에서 시간에 따른 firing rate를 알고 싶다면 kernel smoothing, trial averaging 등을 사용한다.
3. Firing rate만으로 실제 스파이크의 변동성을 설명할 수는 없으므로 Poisson 등의 확률과정이 필요하다.
4. Neural coding을 논하려면 평균 발화율, 정확한 spike timing, spike 사이 상관, neuron 사이 상관을 구분해야 한다.

**다음 장으로 연결:** Chapter 2에서는 자극을 받아 시간에 따른 $r(t)$를 예측하는 구체적인 encoding model을 다룬다.

---

## 참고 자료

- Peter Dayan and L. F. Abbott, *Theoretical Neuroscience: Computational and Mathematical Modeling of Neural Systems*, Chapter 1, **Neural Encoding I: Firing Rates and Spike Statistics**.
- [Dayan & Abbott Chapter 1 PDF (Brown University)](https://www.dam.brown.edu/people/elie/NEUR_1680_2012/Abbott%20Dayan%20Chapter%201.PDF)
- [Methods for Estimating Neural Firing Rates (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2783748/)
