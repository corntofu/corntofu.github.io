---
layout: post
math: true
title: "Dayan & Abbott Chapter 2 — Neural Encoding II: Reverse Correlation and Visual Receptive Fields"
date: 2026-11-27 00:01:00 +0900
description: "Optimal linear kernel과 STA의 관계, Wiener–Hopf equation, LNP 모델, V1의 Gabor receptive field, complex-cell energy model, retina·LGN의 DoG를 수식과 직관으로 정리한다."
tags: computational-neuroscience
categories: Computational Neuroscience
---

*Peter Dayan & L. F. Abbott, Theoretical Neuroscience*, Chapter 2 (pp. 45–84) 공부 노트.

**이 장의 질문:** 시간에 따라 변하는 자극 $s(t)$가 주어졌을 때 뉴런의 firing rate $r(t)$를 어떻게 예측할 수 있을까? 그리고 이 방법으로 망막, LGN, V1 뉴런의 시각적 선택성을 어떻게 설명할 수 있을까?

Chapter 1에서 **관측된 spike train $\rho(t)$로부터 firing rate를 추정**했다면, 이번 장에서는 **stimulus에서 firing rate로 가는 encoding model**을 만든다.

$$
\boxed{
\underbrace{s(t)}_{\text{stimulus}}
\xrightarrow{\text{linear filter }D}
\underbrace{L(t)}_{\text{filtered input}}
\xrightarrow{\text{nonlinearity }F}
\underbrace{r(t)}_{\text{firing rate}}
\xrightarrow{\text{spike generator}}
\underbrace{\rho(t)}_{\text{spike train}}
}
$$

위 모형은 뒤에서 설명할 *Linear–Nonlinear–Poisson (LNP)* 모델의 기본 구조다. 원문은 2.1–2.7에서 linear encoding과 static nonlinearity를 소개한 뒤 retina → LGN → V1의 receptive field를 분석한다.

---

## 1. 자극의 과거가 현재 firing rate를 결정한다 (2.2)

### 1.1 Linear encoding model

현재 반응은 단순히 $s(t)$ 하나가 아니라 **이전에 들어온 자극들의 누적된 영향**을 반영한다. 이를 연속시간의 가중합으로 모델링하면

$$
\boxed{
r_{\mathrm{est}}(t)
=r_0+\int_0^\infty D(\tau)s(t-\tau)\,d\tau
}
\tag{2.1}
$$

가 된다.

- $r_0$: 평균이 제거된 입력이 0일 때의 baseline firing rate
- $s(t-\tau)$: 현재보다 $\tau$만큼 이전의 stimulus
- $D(\tau)$: 그 자극이 현재 반응에 미치는 **크기와 부호**를 나타내는 linear kernel
- $r_{\mathrm{est}}(t)$: 추정된 firing rate

$\tau\ge0$만 적분하므로 **causal filter**다. $D(\tau)>0$인 지연의 양의 자극은 현재 반응을 증가시키고, $D(\tau)<0$인 지연의 양의 자극은 감소시킨다. 책에서는 주로 **stimulus의 평균을 미리 제거**한 상태를 다룬다.

Convolution으로 쓰면 $r_{\mathrm{est}}=r_0+D*s$가 된다. 여기서 $D$는 생물학적 반응을 추정하는 필터이지, Chapter 1에서 우리가 편의상 선택했던 smoothing kernel $K_h$와는 목적이 다르다.

| Chapter 1: 관측 데이터 분석 | Chapter 2: 자극에 대한 예측 |
| --- | --- |
| $\hat r(t)=(K_h*\rho)(t)$ | $r_{\mathrm{est}}(t)=r_0+(D*s)(t)$ |
| Spike train $\rho$가 입력 | Stimulus $s$가 입력 |
| $K_h$는 평활화 폭 등을 사용자가 선택 | $D$는 뉴런 데이터로부터 **학습** |
| 관측 스파이크를 매끄럽게 만든다 | 자극으로 미래 또는 현재 firing rate를 예측한다 |

---

## 2. Optimal linear kernel: 왜 STA와 연결되는가? (2.2)

### 2.1 Least squares로 최적의 $D$ 찾기

실제 평균 firing rate $r(t)$와 선형 모델의 예측 $r_{\mathrm{est}}(t)$가 가깝기를 원한다. 그래서 관측 구간 $T$에서 평균제곱오차를 최소화한다.

$$
\boxed{
E[D]=\frac1T\int_0^T
\left(r(t)-r_0-\int_0^\infty D(u)s(t-u)\,du\right)^2dt
}
\tag{2.3}
$$

$dE/dD$에 해당하는 functional derivative를 0으로 놓는다. 핵심 계산을 보자. $D$를 $D+\varepsilon\eta$만큼 변화시키고 $\varepsilon$의 일차항을 구하면

$$
\delta E
=-\frac2T\int_0^T
\left[r(t)-r_0-\int_0^\infty D(u)s(t-u)\,du\right]
\left[\int_0^\infty \eta(\tau)s(t-\tau)\,d\tau\right]dt.
$$

모든 작은 변화 $\eta(\tau)$에 대해 $\delta E=0$이 되려면 각각의 lag $\tau$에 대해

$$
\langle (r(t)-r_0)s(t-\tau)\rangle_t
=
\int_0^\infty D(u)\langle s(t-u)s(t-\tau)\rangle_t\,du
$$

를 만족해야 한다. 평균이 0인 stationary stimulus를 생각하면

$$
Q_{ss}(\ell)=\langle s(t)s(t+\ell)\rangle_t,\qquad
Q_{rs}(\ell)=\langle r(t)s(t+\ell)\rangle_t
$$

이고 다음 **Wiener–Hopf equation**을 얻는다.

$$
\boxed{
\int_0^\infty Q_{ss}(\tau-u)D(u)\,du
=
Q_{rs}(-\tau)
}
\tag{2.4}
$$

이 식의 의미는 명확하다. **최적 필터 $D$를 구하려면 stimulus의 autocorrelation과 stimulus–response cross-correlation을 함께 알아야 한다.** 입력 자체에 시간 상관이 강하다면 단순히 STA만 사용해서 필터를 얻을 수는 없다.

### 2.2 White noise를 쓰면 적분방정식이 단순해진다

이상적 연속시간 white-noise stimulus라면

$$
Q_{ss}(\ell)=q\,\delta(\ell)
$$

다. $q$는 연속시간 **noise intensity**다. 책의 $\sigma_s^2$에 해당하며, 이산시간의 각 샘플 분산과 같은 의미는 아니다(Chapter 1의 Q5 참고).

위 결과를 대입하면

$$
\begin{aligned}
\int_0^\infty Q_{ss}(\tau-u)D(u)\,du
&=q\int_0^\infty\delta(\tau-u)D(u)\,du\\
&=qD(\tau)\qquad(\tau>0).
\end{aligned}
$$

따라서

$$
D(\tau)=\frac{Q_{rs}(-\tau)}{q}.
$$

그런데 Chapter 1의 STA $C(\tau)$는 충분한 표본과 적절한 평균 아래

$$
C(\tau)=\frac{Q_{rs}(-\tau)}{\langle r\rangle}
$$

로 표현된다. 결국

$$
\boxed{
D(\tau)
=\frac{\langle r\rangle}{q}C(\tau)
}
\tag{2.6}
$$

를 얻는다. **White noise를 제시해 STA를 기록하면 optimal linear kernel을 그에 비례하는 형태로 추정할 수 있다.** 다만 input이 colored noise라면 $Q_{ss}$에 의한 왜곡을 풀어야 하고, 유한한 실험 데이터에서는 estimation error와 regularization의 문제가 추가된다.

### 2.3 Most effective stimulus와 Cauchy–Schwarz

$$
L(t)=\int_0^\infty D(\tau)s(t-\tau)\,d\tau
$$

가 최대가 되는 자극은 무엇일까? 자극을 무한대로 키울 수 없도록 고정된 stimulus energy를 가정한다.

$$
\int_0^\infty s(t-\tau)^2\,d\tau=E_s.
$$

Cauchy–Schwarz 부등식으로

$$
|L(t)|\le
\left(\int_0^\infty D(\tau)^2\,d\tau\right)^{1/2}\sqrt{E_s}.
$$

**최대의 양의 선형 반응**은 자극의 시간적 패턴이 $D$와 비례할 때 발생한다.

$$
\boxed{s(t-\tau)\propto D(\tau)}
$$

즉, linear filter와 자극의 convolution은 **자극이 선호 패턴과 얼마나 잘 일치하는지** 측정한다고 이해하면 된다.

---

## 3. Static nonlinearity와 LNP model (2.2)

### 3.1 Linear model의 한계

선형 계산 $r_0+L(t)$에는 두 가지 문제가 있다.

1. 값이 음수가 될 수 있지만 firing rate는 음수가 될 수 없다.
2. 자극이 강해질수록 무한히 커질 수 있지만 실제 뉴런은 threshold와 saturation을 나타낸다.

따라서 linear term 뒤에 비선형 함수를 결합한다.

$$
L(t)=\int_0^\infty D(\tau)s(t-\tau)\,d\tau,
\qquad
\boxed{r_{\mathrm{est}}(t)=r_0+F(L(t))}
\tag{2.8}
$$

여기서 $F$는 현재 시점의 $L(t)$만을 입력으로 받으므로 **static nonlinearity**라 부른다. 이를 실제 데이터에서 추정하려면 여러 시각의 $(L(t),r(t))$ 쌍을 모아 곡선을 적합하면 된다.

### 3.2 Rectification과 contrast saturation

간단한 유효 firing-rate 함수의 예시는

$$
r_{\mathrm{est}}(t)=\max\{0,r_0+gL(t)\}
$$

이다. 이는 음의 firing rate를 방지한다. 최대 발화율까지 반영하려면 sigmoid나 포화 함수를 사용할 수 있다.

원문은 visual response의 contrast saturation을 설명하기 위해 정류된 응답 $[L]_+=\max(0,L)$에 대한 비선형 함수도 제시한다.

$$
F(L)=\frac{G[L]_+^2}{A_{1/2}^2+G[L]_+^2}.
$$

분모에 제곱 항이 있으므로 입력이 커져도 출력이 점근적으로 포화한다. 이는 경험적 응답을 설명하는 한 모델이지 모든 뉴런에 보편적으로 맞는 법칙은 아니다.

### 3.3 Linear–Nonlinear–Poisson

마지막으로 시간 의존 firing rate를 Chapter 1의 Poisson spike generator에 입력한다.

$$
\boxed{s\xrightarrow{D}L\xrightarrow{F}r\xrightarrow{\text{Poisson}}\rho}
$$

이 모델은 자극에서 spike train까지의 **생성 모델**이다. Poisson이라는 가정에는 조건부 독립성이 포함되므로 실제 뉴런의 refractory period나 spike-history dependence를 완전히 설명하지는 못한다.

---

## 4. Early visual system과 receptive field (2.3)

시각 신호의 대표적인 초기 경로는

$$
\boxed{\text{Retina}\longrightarrow\text{LGN}\longrightarrow\text{V1}}
$$

이다.

- **Retina:** 빛에 반응해 시각 정보를 처리하며, retinal ganglion cell의 축삭이 다음 단계로 전달한다.
- **LGN (lateral geniculate nucleus):** 시상의 시각 중계핵이며 retina에서 들어온 정보를 V1에 전달한다.
- **V1 (primary visual cortex):** 특정 방향의 선, spatial frequency, phase, motion 등에 선택적인 반응이 나타난다.

**Receptive field**는 뉴런의 반응에 영향을 주는 자극의 공간적·시간적 구조다. 단순히 '반응이 일어나는 시야 위치'뿐 아니라 **어떤 위치의 어떤 밝기 변화가 어떤 지연을 두고 흥분 또는 억제에 기여하는가**까지 나타낸다.

시간뿐 아니라 시야의 위치 $(x,y)$를 고려하면

$$
\boxed{
L(t)=\int_0^\infty d\tau\iint dx\,dy\,
D(x,y,\tau)s(x,y,t-\tau)
}
\tag{2.24}
$$

로 확장된다. $D(x,y,\tau)>0$인 영역은 자극이 증가하면 linear response가 커지는 ON 영역, $D(x,y,\tau)<0$인 영역은 반대의 OFF 영역에 대응한다.

### 4.1 공간적 샘플링과 Nyquist frequency

Retina에서 공간을 샘플링하는 간격을 $\Delta x$라 하면, 단순한 균일 샘플링에서 구별할 수 있는 최대 spatial frequency는

$$
f_{\mathrm{Nyquist}}=\frac1{2\Delta x},
\qquad
k_{\mathrm{Nyquist}}=\frac{\pi}{\Delta x}.
$$

이보다 높은 주파수의 줄무늬는 aliasing을 일으킬 수 있다. 여기서 $f$는 주기/거리, $k$는 라디안/거리로 정의한 spatial frequency다.

---

## 5. V1 simple cell: Gabor receptive field (2.4)

### 5.1 Simple cell의 ON/OFF subregion

V1 simple cell의 일부는 가늘고 길게 배열된 ON/OFF 영역을 보인다. 예를 들어 세로 방향으로 길게 이어진 **OFF–ON–OFF** 패턴을 선호한다면 밝은 세로 줄과 양쪽의 어두운 줄이 맞물릴 때 강한 반응을 보일 수 있다.

이 때문에 세로로 놓인 줄무늬에는 잘 반응하지만, 같은 자극을 회전하거나 위치를 옮겨 ON/OFF 영역이 불일치하면 반응이 줄어든다.

### 5.2 Gabor 함수의 수학적 의미

이를 근사하는 대표적인 모델이 **Gaussian envelope × cosine** 형태의 Gabor function이다.

$$
\boxed{
D_s(x,y)=
\frac1{2\pi\sigma_x\sigma_y}
\exp\left(
-\frac{x^2}{2\sigma_x^2}
-\frac{y^2}{2\sigma_y^2}
\right)\cos(kx-\phi)
}
\tag{2.27}
$$

- $\sigma_x,\sigma_y$: receptive field의 가로·세로 크기
- $k$: 선호 각공간주파수. 선호 파장은 $\lambda=2\pi/k$
- $\phi$: 선호 spatial phase. ON/OFF 경계의 위치

Gaussian 부분은 **어느 공간 영역에 민감한가**를 결정한다. Cosine 부분은 **어떤 밝고 어두운 패턴을 선호하는가**를 결정한다.

선호 방향을 $\theta$만큼 회전시키려면

$$
x'=x\cos\theta+y\sin\theta,\qquad
y'=-x\sin\theta+y\cos\theta
$$

로 변환한 좌표를 사용한다.

### 5.3 Spatial frequency와 phase 구분

한 줄무늬를 조금 옆으로 이동시키면 **orientation과 spatial frequency는 그대로**지만 **spatial phase가 변한다**.

Simple cell의 linear response는 필터와 줄무늬가 겹치는 정도에 따라 달라진다. 최적 방향의 grating에서는 대략

$$
L_s\propto
\exp\left[-\frac{\sigma_x^2(k-K)^2}{2}\right]
\cos(\phi-\Phi)
$$

로 표현할 수 있다. $K$는 입력 grating의 공간주파수, $\Phi$는 입력의 phase다.

이 식에서 첫 항은 **spatial-frequency tuning**, 두 번째 항은 **phase selectivity**를 뜻한다. 방향을 포함하면 필터와 grating의 상대적 orientation도 반응에 영향을 준다.

---

## 6. 공간–시간 분리 가능성과 motion selectivity (2.4)

### 6.1 Separable receptive field

공간과 시간이 독립적으로 곱해지는 형태라면

$$
\boxed{D(x,y,\tau)=D_s(x,y)D_t(\tau)}
\tag{2.26}
$$

다. 특정 공간 패턴에 대한 반응 크기나 부호가 시간에 따라 바뀌지만 공간 패턴 자체는 이동하지 않는다.

### 6.2 Nonseparable receptive field

움직이는 자극의 **방향과 속도**에 선택적이라면 시공간 결합이 중요하다.

$$
D(x,y,\tau)\ne D_s(x,y)D_t(\tau).
$$

직관적인 예로

$$
D(x,\tau)=\exp\left[-\frac{(x+v\tau)^2}{2\sigma^2}\right]
$$

를 생각할 수 있다. 이 모델의 선호 위치는 $\tau$에 따라 달라진다. 이 함수는 교재의 정량적 모델을 그대로 복사한 것이 아니라 **공간적 위치와 시간 지연이 결합되는 구조**를 보여 주기 위한 간단한 예시다.

원문은 $(x,\tau)$ 평면의 회전 변환으로 nonseparable space-time filter를 만드는 방법을 설명한다. Filter의 시공간적 기울기와 grating이 이동하는 방향이 일치할 때 강한 반응이 나타날 수 있다.

$$
\boxed{\text{Space–time coupling}\longrightarrow\text{motion direction selectivity}}
$$

---

## 7. V1 complex cell: quadrature pair와 energy model (2.5)

Simple cell이 선호하는 orientation의 줄무늬라도 phase를 바꾸면 반응이 달라질 수 있다. 하지만 complex cell은 orientation이나 spatial frequency를 구별하면서도 **정확한 spatial phase에는 상대적으로 둔감**한 경우가 많다.

### 7.1 Phase를 없애는 방법

위상이 $\pi/2$ 다른 두 필터의 반응을

$$
L_1=A\cos\Phi,\qquad L_2=A\sin\Phi
$$

라고 단순화해 보자. 그러면

$$
\boxed{
L_1^2+L_2^2
=A^2(\cos^2\Phi+\sin^2\Phi)=A^2
}
$$

로 phase $\Phi$가 사라진다. 이 두 필터를 **quadrature pair**라고 한다.

이런 방식의 complex-cell response를

$$
\boxed{r_{\mathrm{est}}(t)=r_0+G\left(L_1(t)^2+L_2(t)^2\right)}
\tag{2.42}
$$

로 나타낼 수 있다. 이것이 **energy model**이다. 이상적인 경우 spatial phase에 대한 의존성이 사라지지만 실제로는 정확한 Gabor 형태와 입력 조건에 따라 약간의 phase dependence가 남을 수 있다.

### 7.2 Frequency doubling

시간에 따른 sinusoidal input에서 linear output이 $\cos(\omega t)$에 비례한다면 energy model에는

$$
\cos^2(\omega t)
=\frac12+\frac12\cos(2\omega t)
$$

항이 생긴다. 따라서 입력의 temporal frequency $\omega$에 대해 반응에는 DC 성분과 **$2\omega$ 성분**이 나타날 수 있다. 원문은 이를 complex-cell response의 frequency doubling과 연결한다.

> **주의:** Phase invariance와 spike timing의 무관함은 같은 말이 아니다. Energy model은 spatial phase에 대한 민감도를 줄이면서도 시간에 따른 반응을 나타낼 수 있다.

---

## 8. Retina와 LGN: Difference of Gaussians (2.6)

### 8.1 Center–surround receptive field

Retina의 일부 ganglion cell과 LGN relay cell은 대체로 원형인 center–surround receptive field를 가진다.

- **ON-center / OFF-surround:** 중심을 밝게 하고 주변을 어둡게 할 때 흥분
- **OFF-center / ON-surround:** 중심을 어둡게 하고 주변을 밝게 할 때 흥분

이를 **Difference of Gaussians (DoG)**로 근사한다.

$$
\boxed{
D_s(x,y)=\pm\left[
G_{\sigma_{\mathrm{cen}}}(x,y)
-BG_{\sigma_{\mathrm{sur}}}(x,y)
\right]
}
\tag{2.45}
$$

여기서

$$
G_\sigma(x,y)=\frac1{2\pi\sigma^2}
\exp\left[-\frac{x^2+y^2}{2\sigma^2}\right],
\qquad
\sigma_{\mathrm{cen}}<\sigma_{\mathrm{sur}}.
$$

좁은 Gaussian은 center, 넓은 Gaussian은 surround를 표현하며 $B$는 둘의 상대적 강도다. 부호를 바꾸면 ON-center와 OFF-center를 바꿀 수 있다.

### 8.2 왜 균일한 밝기에 둔감할까?

정규화된 Gaussian은 각각 공간 적분이 1이다.

$$
\iint G_\sigma(x,y)\,dx\,dy=1.
$$

따라서 $B=1$이면

$$
\iint D_s(x,y)\,dx\,dy=0.
$$

공간 전체에 일정한 밝기 자극 $s(x,y)=c$를 주면

$$
L=c\iint D_s(x,y)\,dx\,dy=0.
$$

즉 이런 모델은 균일한 밝기보다 **중심과 주변의 대비(contrast)**에 민감하다. 일반적으로 $B\ne1$이면 균일 자극이 완전히 상쇄되지 않을 수도 있다.

원문에서는 center와 surround의 **시간 반응도 서로 다를 수 있음**을 보여 준다. 따라서 center-surround의 공간 구조가 단순해 보여도 전체 space-time receptive field가 반드시 separable인 것은 아니다.

---

## 9. LGN 입력을 모으면 V1의 방향 선택성이 생길까? (2.7)

LGN의 많은 receptive field는 원형 center–surround 구조다. 그런데 V1 simple cell에는 길쭉한 ON/OFF 영역이 나타난다.

Hubel–Wiesel의 고전적 모델에서는 **여러 LGN 뉴런의 입력이 특정 방향으로 배열되어 V1 neuron에 수렴**한다고 설명한다.

$$
\boxed{
D_{\mathrm{V1}}(x,y)
\approx
\sum_{j=1}^{M}w_jD_{\mathrm{LGN},j}(x,y)
}
$$

적절히 정렬된 ON-center, OFF-center 입력을 합하면 길쭉한 ON/OFF 영역이 만들어지고, 이는 특정 orientation에 잘 반응하는 simple-cell receptive field를 생성할 수 있다.

더 나아가 spatial phase가 다른 simple-cell 응답들을 비선형적으로 합치면 complex-cell의 phase invariance도 근사할 수 있다. 다만 이 모델들은 **선택성이 생길 수 있는 원리**를 설명하는 것이며, 실제 회로 전체의 생물물리학을 재현한다는 뜻은 아니다.

---

## 10. Chapter 2의 전체 연결

| 개념 | 핵심 수식 | 역할 |
| --- | --- | --- |
| Linear encoder | $r_{\mathrm{est}}=r_0+D*s$ | 자극의 과거로부터 rate를 예측 |
| Wiener–Hopf | $Q_{ss}*D=Q_{rs}(-\tau)$ | 최소제곱오차 기준 최적 filter |
| White-noise STA | $D=\langle r\rangle C/q$ | STA로부터 optimal linear kernel 추정 |
| Static nonlinearity | $r_{\mathrm{est}}=r_0+F(L)$ | threshold·saturation 반영 |
| LNP model | $s\to L\to r\to\rho$ | 자극에서 확률적 spike까지 생성 |
| Spatiotemporal RF | $D(x,y,\tau)$ | 시각의 공간–시간 선택성 |
| Gabor | $G(x,y)\cos(kx-\phi)$ | V1 simple-cell selectivity |
| Energy model | $L_1^2+L_2^2$ | Complex-cell의 phase invariance |
| DoG | $G_{\sigma_c}-BG_{\sigma_s}$ | Retina·LGN의 center–surround |

이 장의 가장 중요한 연결은 다음과 같다.

$$
\boxed{
\text{STA}
\xrightarrow{\text{white-noise / least squares}}
\text{optimal linear filter}
\xrightarrow{\text{nonlinearity}}
\text{firing-rate model}
}
$$

V1의 Gabor filter와 retina·LGN의 DoG는 **서로 다른 부호화 특성을 같은 filtering framework 안에서 표현**한다는 점에서 중요하다.

---

## 11. 이해도 점검 — 질문을 눌러 해설 보기

<details markdown="1">
<summary><strong>Q1. Chapter 1의 smoothing kernel과 Chapter 2의 linear kernel은 어떻게 다른가?</strong></summary>

Chapter 1의 $K_h$는 spike train $\rho$에 smoothing을 적용해 rate를 **추정**하는 데 사용한다.

$$
\hat r=K_h*\rho
$$

Chapter 2의 $D$는 자극에 의해 뉴런이 어떻게 반응하는지를 데이터에서 **학습**한 filter다.

$$
r_{\mathrm{est}}=r_0+D*s
$$

같은 convolution 연산이지만 입력과 목적이 다르다.

</details>

<details markdown="1">
<summary><strong>Q2. White noise에서 optimal kernel이 STA에 비례하는 이유는?</strong></summary>

Wiener–Hopf equation

$$
\int Q_{ss}(\tau-u)D(u)\,du=Q_{rs}(-\tau)
$$

에 $Q_{ss}(\ell)=q\delta(\ell)$를 대입하면 왼쪽이 $qD(\tau)$가 된다. 한편 Chapter 1의 STA 관계 $Q_{rs}(-\tau)=\langle r\rangle C(\tau)$를 쓰면

$$
D(\tau)=\frac{\langle r\rangle}{q}C(\tau)
$$

를 얻는다. Colored noise에서는 일반적으로 이 단순한 비례 관계가 성립하지 않는다.

</details>

<details markdown="1">
<summary><strong>Q3. Gabor 함수에서 spatial frequency와 spatial phase는 어떻게 다른가?</strong></summary>

$$
D_s(x,y)\propto e^{-\cdots}\cos(kx-\phi)
$$

에서 $k$는 줄무늬의 **간격**, $\phi$는 줄무늬의 **위치**를 결정한다. 같은 방향과 간격의 grating을 옆으로 이동시키면 spatial phase가 변한다. 따라서 simple cell의 linear response가 달라질 수 있다.

</details>

<details markdown="1">
<summary><strong>Q4. Complex cell의 energy model은 왜 phase에 둔감한가?</strong></summary>

Quadrature pair의 응답을 $L_1=A\cos\Phi$, $L_2=A\sin\Phi$로 근사하면

$$
L_1^2+L_2^2=A^2
$$

가 되어 $\Phi$가 사라진다. 이것은 phase가 다른 두 신호 성분의 제곱합을 취한 결과다.

</details>

<details markdown="1">
<summary><strong>Q5. DoG에서 center와 surround의 Gaussian 폭을 다르게 쓰는 이유는?</strong></summary>

Center는 좁은 위치에, surround는 넓은 위치에 영향을 주어야 하기 때문이다.

$$
\sigma_{\mathrm{cen}}<\sigma_{\mathrm{sur}}
$$

로 두면 중심의 양의 반응과 주변의 음의 반응을 표현할 수 있다. $B=1$로 정규화한 경우 공간 전체에 균일한 밝기가 주어지면 두 기여가 상쇄된다.

</details>

<details markdown="1">
<summary><strong>Q6. Motion direction selectivity에 시공간 nonseparability가 중요한 이유는?</strong></summary>

움직이는 자극은 시간에 따라 위치가 달라진다. 그 움직임을 구별하려면 kernel의 공간 좌표와 시간 지연 사이에 결합이 필요할 수 있다.

$$
D(x,\tau)\ne D_s(x)D_t(\tau)
$$

인 receptive field에서는 특정 방향·속도로 움직이는 자극이 필터와 잘 맞지만 반대 방향 움직임은 잘 맞지 않을 수 있다.

</details>

---

## 12. 다음 장으로 연결

Chapter 2는 **encoding** 문제, 즉 *stimulus에서 neural response를 예측*하는 문제를 다뤘다. 이어지는 Chapter 3은 정반대로 **decoding**, 즉 *observed neural response에서 stimulus를 추정*하는 문제를 다룬다.

$$
\text{Encoding: }s\longrightarrow r,\rho
\qquad\qquad
\text{Decoding: }\rho\longrightarrow\hat s
$$

이후 BCI를 학습할 때도 이 차이는 중요하다. 감각입력에서 neural response를 예측하는 모델과, 신경 반응에서 행동 의도 등을 복원하는 decoder는 서로 다른 문제다.

---

## 참고 자료

- Peter Dayan and L. F. Abbott, *Theoretical Neuroscience: Computational and Mathematical Modeling of Neural Systems*, Chapter 2, **Neural Encoding II: Reverse Correlation and Visual Receptive Fields**, pp. 45–84.
- [Dayan & Abbott, 원문 PDF — Yale Boulder School](https://boulderschool.yale.edu/sites/default/files/files/DayanAbbott.pdf)
- [Theoretical Neuroscience — MIT Press 도서 정보](https://mitpress.mit.edu/9780262541855/theoretical-neuroscience/)
- [Chapter 1 학습 노트]({{ '/blog/2026/dayan-abbott-chapter-1/' | relative_url }})
