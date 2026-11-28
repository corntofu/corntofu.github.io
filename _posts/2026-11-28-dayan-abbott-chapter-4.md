---
layout: post
math: true
title: "Dayan & Abbott Chapter 4 — Information Theory"
date: 2026-11-28 17:46:00 +0900
description: "Shannon entropy, mutual information, KL divergence, histogram equalization, factorial coding, whitening과 Wiener filtering, spike-train direct method를 유도하고 인터랙티브 예제로 설명한다."
tags: computational-neuroscience
categories: Computational Neuroscience
---

*Peter Dayan & L. F. Abbott, Theoretical Neuroscience*, Chapter 4 **Information Theory** (pp. 123–150) 학습 노트.

> **이번 장의 질문:** 뉴런의 response는 자극에 대해 **평균적으로 몇 bit의 정보**를 전달할까? 그리고 자연계의 자극 통계와 생물학적 noise를 고려하면 어떤 receptive field가 효율적일까?

Chapter 1에서 spike statistics, Chapter 2에서 encoding, Chapter 3에서 decoding을 다뤘다. Chapter 4는 그 모두를 정보이론으로 연결한다.

$$
\underbrace{S\xrightarrow{\text{encoding}}R}_{\text{입력과 반응의 확률적 관계}}
\qquad\Longrightarrow\qquad
\boxed{I(S;R)=H(R)-H(R\mid S)}
$$

원문은 **4.1 Entropy and Mutual Information**, **4.2 Information and Entropy Maximization**, **4.3 Entropy and Information for Spike Trains**, **4.4 Chapter Summary**와 부록의 KL divergence 성질로 구성된다.

| 원문 | 연구 질문 | 핵심 도구 |
| --- | --- | --- |
| 4.1 | 반응의 변동성 중 어느 부분이 자극의 정보를 담는가? | Entropy, conditional entropy, MI, KL |
| 4.2 | 어떻게 반응 특성을 설계해야 정보를 효율적으로 보낼까? | Equalization, factorial code, whitening, noise filtering |
| 4.3 | Spike count가 아니라 전체 spike timing에는 몇 bit가 담겼을까? | Spike words, entropy rate, direct method |
| 4.4–4.5 | 정리와 수학적 성질 | Jensen inequality, KL $\ge0$ |

---

## 1. Entropy: 왜 로그로 놀라움을 측정할까? (4.1)

### 1.1 한 사건의 self-information

반응 $r$가 관측될 확률이 $P(r)$이면 그 사건의 정보량(놀라움)을

$$
\boxed{h(r)=-\log_2P(r)}
\tag{4.2}
$$

로 정의한다.

발생할 확률이 낮은 사건일수록 $h(r)$가 크다. 로그를 쓰는 이유는 **독립적인 두 사건의 결합확률은 곱이지만 정보량은 더해지도록** 하기 위해서다.

$$
\begin{aligned}
h(A,B)
&=-\log_2\big(P(A)P(B)\big)\\
&=h(A)+h(B)\qquad(A\perp B).
\end{aligned}
$$

예를 들어 $P(r)=1/2$면 1 bit, $1/8$이면 3 bits다. 밑이 2인 로그를 사용하므로 단위를 bit라 부른다.

### 1.2 Shannon entropy는 평균적인 불확실성

사건마다의 놀라움을 확률로 가중평균하면

$$
\boxed{
H(R)=-\sum_rP(r)\log_2P(r)
}
\tag{4.3}
$$

이다. 확률이 0인 항은 $0\log0=0$으로 약속한다.

한 시간 bin 안에서 spike가 발생했으면 1, 없으면 0이라고 하자.

$$
R\in\{0,1\},\qquad P(R=1)=p.
$$

이때 binary entropy는

$$
\boxed{
H_2(p)=-p\log_2p-(1-p)\log_2(1-p)
}
$$

다. $p=0$ 또는 $1$이면 결과가 확실하므로 0 bit다. 반면 $p=1/2$에서는 두 경우가 동등하게 가능하여 1 bit로 최대가 된다.

**주의:** Entropy는 response의 **불확실성**이지 stimulus에 대한 **유용한 정보량**이 아니다. 자극에 무관하게 완전히 무작위로 발화해도 entropy는 높을 수 있다.

---

## 2. Mutual information: 어떤 변동성이 자극 정보를 담는가? (4.1)

### 2.1 Total response entropy에서 noise entropy를 뺀다

동일한 stimulus $s$를 반복 제시해도 뉴런의 반응은 trial마다 달라진다. 이는 자극이 변해서 나타나는 변동성과 **동일 자극에서도 나타나는 response noise**를 구별해야 한다는 뜻이다.

조건부 entropy를

$$
H(R\mid S=s)=-\sum_rP(r\mid s)\log_2P(r\mid s)
$$

로 정의한다. 여러 자극에 대해 평균하면

$$
\boxed{
H(R\mid S)
=-\sum_sP(s)\sum_rP(r\mid s)\log_2P(r\mid s)
}
\tag{4.6}
$$

이다. 이 값을 원문에서는 **noise entropy**라고 부른다. 반면 자극을 구별하지 않고 측정한 모든 반응의 entropy는 **total response entropy**다.

따라서

$$
\boxed{
I(S;R)=\underbrace{H(R)}_{\text{전체 반응의 변동성}}
-\underbrace{H(R\mid S)}_{\text{동일 자극에서도 남는 변동성}}
}
\tag{4.7}
$$

를 정의한다. 반대로 생각하면 $I(S;R)=H(S)-H(S\mid R)$이므로, **반응을 관측한 뒤 자극에 대한 불확실성이 얼마나 줄었는가**와도 같다.

### 2.2 KL divergence와의 관계

Bayes' theorem 및 $P(s,r)=P(s)P(r\mid s)$를 이용하면

$$
\begin{aligned}
I(S;R)
&=\sum_{s,r}P(s,r)\log_2\frac{P(r\mid s)}{P(r)}\\
&=\boxed{
\sum_{s,r}P(s,r)\log_2\frac{P(s,r)}{P(s)P(r)}
}.
\end{aligned}
\tag{4.11}
$$

두 확률분포 $P,Q$의 KL divergence를

$$
D_{\mathrm{KL}}(P\|Q)
=\sum_xP(x)\log_2\frac{P(x)}{Q(x)}
$$

라고 하면

$$
\boxed{
I(S;R)=D_{\mathrm{KL}}\!\left(P(S,R)\,\middle\|\,P(S)P(R)\right)
}
$$

이다. **실제 stimulus–response 결합분포가 두 변수가 독립일 때의 분포에서 얼마나 벗어나는가**를 측정하는 것이다.

$D_{\mathrm{KL}}\ge0$이므로 $I(S;R)\ge0$이다. $S,R$가 독립이면 $P(s,r)=P(s)P(r)$여서 $I=0$이다. 단, KL은 방향이 있는 비대칭량이지 보통의 거리(metric)는 아니다.

### 2.3 직접 실험: 오류율을 바꾸면 정보가 얼마나 줄어들까?

두 자극 $S\in\{+,-\}$가 각각 확률 $1/2$로 제시되고, 출력도 두 가지이며 양쪽에서 동일한 오류율 $p_e$를 갖는 **binary symmetric channel**을 생각한다.

이때 $H(R)=1$ bit이고 $H(R\mid S)=H_2(p_e)$이므로

$$
\boxed{
I(S;R)=1-H_2(p_e)
}
\tag{4.14}
$$

가 된다.

<link rel="stylesheet" href="{{ '/assets/css/neuroscience-binary-information.css' | relative_url }}">

<div id="nc-ch4-binary-demo" class="nc-ch4-demo">
  <p class="nc-ch4-heading">Interactive · Binary channel &amp; Mutual information</p>
  <p class="nc-ch4-subtitle">자극은 동일한 비율로 등장하고, 출력의 전체 entropy는 언제나 1 bit이다. 오류율만 움직여 자극과 반응이 공유하는 정보가 어떻게 달라지는지 확인해 보자.</p>
  <div class="nc-ch4-control">
    <label for="nc-ch4-error">Error probability <i>p</i><sub>e</sub></label>
    <output for="nc-ch4-error" id="nc-ch4-error-value">10%</output>
  </div>
  <input id="nc-ch4-error" type="range" min="0" max="0.5" step="0.01" value="0.1" aria-describedby="nc-ch4-interpretation">
  <div class="nc-ch4-limit"><span>0% · 오류 없음</span><span>50% · 무작위 추측</span></div>
  <div class="nc-ch4-metrics">
    <div class="nc-ch4-metric"><span>Noise entropy H(R|S)</span><strong id="nc-ch4-noise-entropy">0.469 bits</strong></div>
    <div class="nc-ch4-metric"><span>Mutual information I(S;R)</span><strong id="nc-ch4-mutual-info">0.531 bits</strong></div>
  </div>
  <svg viewBox="0 0 620 265" id="nc-ch4-info-chart" role="img" aria-label="오류 확률에 따른 noise entropy와 mutual information 그래프"></svg>
  <div class="nc-ch4-legend">
    <span><i style="background:#8162d6"></i>Noise entropy</span>
    <span><i style="background:#0d9488"></i>Mutual information</span>
  </div>
  <p id="nc-ch4-interpretation" class="nc-ch4-insight" aria-live="polite">오류율을 움직이면 각 값이 업데이트된다.</p>
  <p class="nc-ch4-footnote">학습용 이론 모델이다. 오류율을 0~50%로 제한했고 각 자극의 등장확률은 50%로 고정했다.</p>
  <noscript><p>인터랙티브 그래프는 JavaScript를 활성화하면 작동한다. 수식 I = 1 − H₂(pₑ)를 사용해 직접 계산할 수도 있다.</p></noscript>
</div>

<script defer src="{{ '/assets/js/neuroscience-binary-information.js' | relative_url }}"></script>

예를 들어 오류가 0이면 1 bit를 모두 전달하고, 오류가 50%면 stimulus와 response가 독립이 되어 0 bit만 전달한다. **전체 entropy는 그대로지만 noise entropy가 증가하기 때문에 정보량이 줄어든다**는 점이 핵심이다.

---

## 3. Continuous entropy와 Chapter 3의 Fisher information (4.1)

### 3.1 연속변수에서 entropy가 다르게 작동하는 이유

Firing rate를 연속확률변수 $R$로 나타내면 확률밀도 $p(r)$를 사용한다.

$$
\boxed{h(R)=-\int p(r)\log_2p(r)\,dr}
$$

를 **differential entropy**라고 한다.

측정 해상도 $\Delta r$로 이산화한 entropy는 작은 bin의 극한에서

$$
H_{\Delta r}(R)\approx h(R)-\log_2\Delta r
$$

이다. 따라서 $\Delta r$를 바꾸면 값이 달라지고, differential entropy 자체는 음수가 될 수도 있다. 연속변수 entropy를 이산 변수 entropy와 완전히 같은 양으로 다루면 안 된다.

하지만 mutual information

$$
I(S;R)=H(R)-H(R\mid S)
$$

에서는 공통적인 측정 해상도 항이 소거되어

$$
\boxed{
I(S;R)=\iint p(s,r)\log_2\frac{p(s,r)}{p(s)p(r)}\,ds\,dr
}
$$

로 쓸 수 있다. 적절한 조건에서 이 값은 좌표의 일대일 재표현에도 불변이다. 다만 모든 연속확률모형에서 반드시 유한한 값이 되는 것은 아니다.

### 3.2 Fisher information과 mutual information은 다르다

Chapter 3에서 Fisher information을

$$
I_F(s)
=\mathbb E_{R\mid s}
\left[
\left(\frac{\partial}{\partial s}\log p(R\mid s)\right)^2
\right]
$$

로 정의했다.

| Fisher information | Mutual information |
| --- | --- |
| 특정 $s$ 주변의 **국소적** 구분 능력 | 자극 전체 분포에서의 **평균적** 정보 |
| Likelihood의 기울기 사용 | Entropy 및 posterior의 감소 사용 |
| Cramér–Rao bound와 연결 | Encoding의 정보 전달량과 연결 |

Posterior가 한 개의 좁은 Gaussian peak로 근사되는 상황에서는 두 양이 관계를 가질 수 있지만, 일반적으로 동일한 수량이 아니다.

---

## 4. Maximum entropy: 뉴런의 출력 분포는 어떠해야 할까? (4.2)

### 4.1 최대 firing rate만 제약했을 때

뉴런이 $0\le r\le r_{\max}$ 범위에서 반응한다고 하자. Noise entropy가 충분히 작거나 모델에 따라 거의 일정하다면 **response entropy를 최대화하는 것**이 mutual information을 증가시키는 근사 전략이 된다.

$$
\max_{p(r)}
\left[-\int_0^{r_{\max}}p(r)\ln p(r)\,dr\right]
\quad\text{s.t.}\quad\int_0^{r_{\max}}p(r)\,dr=1.
$$

라그랑주 승수 $\lambda$를 도입한다.

$$
\mathcal L[p]
=-\int p(r)\ln p(r)\,dr
-\lambda\left(\int p(r)\,dr-1\right).
$$

변분을 취하면

$$
\frac{\delta\mathcal L}{\delta p(r)}
=-(\ln p(r)+1)-\lambda=0.
$$

따라서 $\ln p(r)$가 상수이므로 $p(r)$는 균일하다.

$$
\boxed{
p(r)=\frac1{r_{\max}}
\quad(0\le r\le r_{\max})
}
\tag{4.22}
$$

**해석:** 뉴런이 특정 firing-rate 값에만 몰리지 않고 허용된 출력 범위를 고르게 활용하는 것이 유리하다.

그런데 중요한 조건이 있다. **허용된 최대 발화율을 고정한 경우에만** 균일 분포가 최적이다. 평균 firing rate를 고정하는 다른 제약에서는 지수분포가 최적일 수 있고, 평균과 분산을 고정한 전체 실수 지지집합에서는 Gaussian이 최적이다.

### 4.2 Histogram equalization의 직접 유도

Stimulus $s$가 확률밀도 $p(s)$를 따르고 뉴런이 **단조증가** tuning curve $r=f(s)$로 반응한다고 하자. 아주 작은 구간에 대해 확률보존을 적용하면

$$
p(s)\,ds=p(r)\,dr=p(f(s))f'(s)\,ds.
$$

출력이 $p(r)=1/r_{\max}$로 균일하도록 하려면

$$
p(s)=\frac1{r_{\max}}f'(s).
$$

따라서

$$
\boxed{
f'(s)=r_{\max}p(s)
}
\tag{4.24}
$$

가 된다. 이를 적분하면

$$
\boxed{
f(s)=r_{\max}\int_{s_{\min}}^s p(u)\,du
=r_{\max}F_S(s)
}
\tag{4.25}
$$

다. $F_S$는 stimulus의 CDF이다.

**왜 CDF가 등장할까?** Stimulus가 자주 발생하는 영역에서는 tuning curve가 더 빠르게 증가해 자극을 더 세밀하게 구별하도록 만들고, 잘 발생하지 않는 영역에서는 더 천천히 변화하도록 만드는 것이다.

이것은 영상처리의 **histogram equalization**과 같은 원리다.

원문에서 소개하는 Laughlin(1981)의 파리 시각계 **large monopolar cell(LMC)** 실험에서는 자연 자극의 contrast CDF와 실제 뉴런 반응을 비교한다. 그 반응은 spike rate가 아니라 **막전위 변화의 진폭**으로 측정되었다는 점에 주의하자.

---

## 5. Population code는 왜 독립적인 특징을 담는 것이 유리한가? (4.2)

### 5.1 Joint entropy의 상한

반응 벡터를 $\boldsymbol R=(R_1,\ldots,R_N)$이라고 하자.

$$
\boxed{
H(\boldsymbol R)\le\sum_{a=1}^N H(R_a)
}
\tag{4.28}
$$

이고 등호는 반응 변수들이 **서로 독립**일 때 성립한다.

두 뉴런에 대해서는 chain rule로

$$
H(R_1,R_2)=H(R_1)+H(R_2\mid R_1)
\le H(R_1)+H(R_2)
$$

를 얻는다. 두 번째 뉴런이 첫 번째 뉴런과 완전히 동일한 반응만 나타낸다면 별도의 entropy를 충분히 추가하지 못한다.

### 5.2 Factorial code와 total correlation

독립인 population의 결합분포는

$$
P(R_1,\ldots,R_N)=\prod_aP(R_a)
$$

로 factorize된다. 원문은 이런 형태를 **factorial code**라고 부른다.

의존성의 크기는

$$
\boxed{
\sum_a H(R_a)-H(\boldsymbol R)
=
D_{\mathrm{KL}}
\left(
P(\boldsymbol R)
\middle\|
\prod_aP(R_a)
\right)
}
$$

로 표현할 수 있다. 이는 **total correlation(multi-information)**이다.

하지만 $R_a$들이 독립적이라는 사실이 곧 자극에 대한 **mutual information이 최대**라는 뜻은 아니다. 자극 정보를 전혀 갖지 않는 독립적인 noise 뉴런들로도 factorial code를 만들 수 있기 때문이다. 자연 자극의 redundancy를 줄이는 것은 **정보효율을 높이는 하나의 설계 원리**로 이해해야 한다.

### 5.3 Gaussian response라면 decorrelation이 중요하다

여러 반응이 결합 Gaussian 분포를 따른다면 공분산 행렬의 비대각 원소를 0으로 만드는 것만으로 통계적 독립성을 얻을 수 있다. 그러나 **일반적인 비Gaussian 변수에서는 decorrelation과 independence가 다르다**.

이제 다음 절의 whitening이 왜 등장하는지 이해할 수 있다. **반응 사이의 상관을 줄이고 각 채널의 변동성을 균일화**하기 위한 선형 변환이기 때문이다.

---

## 6. Whitening: 왜 retinal receptive field가 center–surround인가? (4.2)

### 6.1 자연영상의 통계

자연영상에서는 가까운 픽셀들의 밝기가 비슷한 경향이 있다. 저주파 영역이 비교적 강하기 때문에 공간주파수 벡터 $\boldsymbol k$에 대한 power spectrum은 일정 범위에서 대략

$$
\boxed{
Q_{ss}(\boldsymbol k)\propto\frac1{|\boldsymbol k|^2}
}
$$

로 근사된다. $|\boldsymbol k|\to0$에서 이 근사의 발산은 실제로 적절히 정규화되어야 하며, 눈의 광학적 blur 또한 고려된다.

### 6.2 Fourier domain에서 whitening filter 유도

공간 필터 $D_s$를 적용하면 Fourier domain에서는

$$
\widetilde L(\boldsymbol k)
=\widetilde D_s(\boldsymbol k)\widetilde s(\boldsymbol k)
$$

이고 출력 power spectrum은

$$
Q_{LL}(\boldsymbol k)
=|\widetilde D_s(\boldsymbol k)|^2Q_{ss}(\boldsymbol k)
$$

이다. 이 출력 power를 주파수에 무관하게 일정하게 만들려면

$$
\boxed{
|\widetilde D_s(\boldsymbol k)|^2Q_{ss}(\boldsymbol k)
=\sigma_L^2
}
\tag{4.41}
$$

가 되어야 하므로

$$
\boxed{
|\widetilde D_s(\boldsymbol k)|
=\frac{\sigma_L}{\sqrt{Q_{ss}(\boldsymbol k)}}
}
\tag{4.42}
$$

를 얻는다. 이것이 **whitening filter**다.

자연영상에서 $Q_{ss}\propto1/|\boldsymbol k|^2$이면

$$
|\widetilde D_s(\boldsymbol k)|\propto|\boldsymbol k|.
$$

따라서 중복적인 저주파를 줄이고 edge에 해당하는 공간적 변화를 상대적으로 강조한다. 이것이 Chapter 2에서 다룬 **center–surround receptive field**를 정보효율 관점에서 설명하는 실마리다.

**주의:** Power spectrum을 일정하게 만드는 조건은 필터의 **크기 응답만 결정**한다. 위상까지 고정하지 않으므로 어떤 공간 필터가 유일하게 결정되는 것은 아니다.

### 6.3 White noise를 그대로 증폭하면 생기는 문제

Whitening만 최적화하면 입력 신호가 극히 약한 고주파까지 지나치게 증폭할 수 있다. 하지만 그 대역에서 실제 입력은 signal보다 **biophysical noise**가 더 크기 쉽다.

입력이 $y=s+\eta$이고 signal과 noise가 서로 uncorrelated라고 하자. Signal spectrum을 $S(\boldsymbol k)$, noise spectrum을 $N(\boldsymbol k)$라고 하면 입력을 원래 signal에 가깝게 복원하는 Wiener noise filter는

$$
\boxed{
\widetilde D_\eta(\boldsymbol k)
=\frac{S(\boldsymbol k)}{S(\boldsymbol k)+N(\boldsymbol k)}
}
\tag{4.46}
$$

이다.

이 필터와 whitening을 근사적으로 결합하면

$$
\boxed{
|\widetilde D_s(\boldsymbol k)|
\propto
\frac{\sqrt{S(\boldsymbol k)}}{S(\boldsymbol k)+N(\boldsymbol k)}
}
\tag{4.47}
$$

가 된다. 이 식은 noise가 약할 때는 whitening에 가까워지고, noise가 강한 주파수에서는 응답을 억제한다.

| 상황 | 결과의 직관 |
| --- | --- |
| 높은 signal-to-noise ratio | 상관을 줄이는 band-pass / center–surround 특성이 뚜렷 |
| 낮은 signal-to-noise ratio | 고주파 noise를 억제해 low-pass 경향, surround 약화 |

이는 밝은 조명과 어두운 조명에서 retinal ganglion cell receptive field가 달라지는 현상을 이해하는 데 도움을 준다. **Center–surround는 모든 조명에서 항상 동일해야 하는 고정 구조가 아니다.**

---

## 7. LGN의 temporal whitening과 V1의 선택성 (4.2)

### 7.1 시간에 대해서도 whitening할 수 있다

자연영상은 공간적으로뿐 아니라 **시간적으로도** 강한 상관을 갖는다. 시야의 변화가 비교적 천천히 일어나면 인접 시각의 입력이 비슷하다.

시간주파수 $\omega$에 대해서도 같은 아이디어를 적용하면

$$
\boxed{
|\widetilde D_t(\omega)|
\propto
\frac{\sqrt{Q_{ss}(\omega)}}
{Q_{ss}(\omega)+Q_{\eta\eta}(\omega)}
}
\tag{4.50}
$$

를 얻는다. 교재에서 사용한 자연영상의 temporal spectrum 근사는

$$
Q_{ss}(\omega)\propto\frac1{\omega^2+\omega_0^2}
$$

이다.

저주파의 중복을 줄이는 whitening과 고주파의 noise를 억제하는 동작이 결합되면 LGN 뉴런의 temporal-frequency tuning을 설명할 수 있다.

### 7.2 Filter의 크기와 위상, 그리고 인과성

여기까지의 정보최적화는 Fourier magnitude $|\widetilde D_t(\omega)|$를 결정할 뿐이다. 실제 뉴런은 미래 자극을 미리 볼 수 없으므로

$$
\boxed{D_t(\tau)=0\quad(\tau<0)}
$$

이어야 한다. 원문에서는 **causality**와 **minimum phase** 등의 추가 조건을 이용해 temporal kernel의 형태를 정한다.

### 7.3 V1까지 연결하면

V1의 뉴런들은 spatial frequency와 temporal frequency에 대해 서로 다른 선호를 갖는다. 원문에서는 자연 시각자극의 spatiotemporal spectrum을

$$
Q_{ss}(\boldsymbol k,\omega)
\propto\frac1{|\boldsymbol k|^2+\alpha^2\omega^2}
$$

형태로 모델링하여, **높은 공간주파수를 선호하는 뉴런이 시간적으로는 낮은 주파수에 더 민감**해질 수 있는 이유를 설명한다.

다만 V1에서는 object recognition과 특징 추출 같은 계산도 중요하므로 **정보전달량의 최대화만으로 시각피질의 모든 선택성이 설명되는 것은 아니다.**

---

## 8. Spike train 전체의 정보량: Direct method (4.3)

### 8.1 왜 firing rate만으로는 부족한가?

같은 1초 동안 10개의 spike가 발생한 두 trial도 spike 시각은 다를 수 있다.

$$
N=10\quad\not\Rightarrow\quad\rho_1(t)=\rho_2(t).
$$

정확한 spike timing에 정보가 있다면 spike count만 이용한 분석은 이를 놓친다. 이를 측정하기 위해 작은 시간 bin에 spike를 0과 1로 기록한 **binary spike word**를 만든다.

예를 들어

$$
B=(0,1,0,0,1,1,0,1)
$$

은 길이 8의 spike word다. 한 word의 길이가 $T_s$이고 bin 크기가 $\Delta t$라면

$$
M=\frac{T_s}{\Delta t},
\qquad
\text{가능한 word 수}=2^M
$$

다. 이 때문에 시간 해상도를 높이거나 word 길이를 늘리면 데이터 요구량이 급격히 증가한다.

### 8.2 Total spike-train entropy rate

긴 실험기록의 **어느 시각에서든** 나타나는 word $B$의 확률을 $P(B)$라고 한다.

$$
\boxed{
\dot H_{\mathrm{total}}(T_s)
=-\frac1{T_s}\sum_B P(B)\log_2P(B)
}
\tag{4.54}
$$

단위는 **bits/s**다. 이 값은 길이 $T_s$짜리 word의 entropy를 시간으로 나눈 것으로, 유한한 $T_s$에서는 긴 시간에 걸친 word 간 상관을 모두 반영하지 못할 수 있다.

### 8.3 동일 stimulus를 반복했을 때의 noise entropy rate

동일한 시간적 stimulus sequence를 여러 trial 반복하자. 시각 $t$부터 시작하는 word $B(t)$에 대해 반복 trial 사이의 경험적 확률 $P(B\mid t)$를 추정할 수 있다.

$$
\boxed{
\dot H_{\mathrm{noise}}(T_s)
=-\frac1T\int_0^T
\frac1{T_s}\sum_B P(B\mid t)\log_2P(B\mid t)\,dt
}
\tag{4.55}
$$

이렇게 **동일 자극의 동일 시간**에 나타나는 반응의 불규칙성을 계산한다. 실제 구현에서는 시간 bin에 대한 이산 평균을 사용한다.

정보율은

$$
\boxed{
\mathcal I
=\dot H_{\mathrm{total}}-\dot H_{\mathrm{noise}}
}
$$

이다. 이것은 일반적인 mutual information $I(S;R)=H(R)-H(R\mid S)$를 **spike-word sequence와 시간에 대한 정보율**로 확장한 결과다.

### 8.4 왜 $T_s\to\infty$ 외삽을 할까?

작은 $T_s$를 쓰면 서로 다른 word 사이의 긴 correlation을 놓치기 때문에 계산된 entropy rate가 실제 entropy rate보다 클 수 있다.

반대로 $T_s$를 너무 크게 하면 가능한 word의 종류가 $2^{T_s/\Delta t}$로 증가해, **빈도 추정에 필요한 데이터가 부족**해진다.

교재는 충분히 큰 $T_s$에서 entropy rate의 편차가 대략 $1/T_s$에 비례한다는 근거로

$$
\dot H(T_s)\approx\dot H_\infty+\frac{a}{T_s}
$$

를 적합해 $1/T_s\to0$으로 외삽한다. 다만 실제 데이터가 희소해지는 구간은 외삽에 사용하기 어렵다.

### 8.5 실험: 파리 H1 뉴런이 전달한 78 bits/s

원문 Figure 4.7의 실험은 motion-sensitive **fly H1 neuron**의 spike train을 분석한다. Spike timing resolution은 $\Delta t=3\,\mathrm{ms}$이다.

| 측정량 | 결과 |
| --- | ---: |
| Full spike-train entropy rate | **157 bits/s** |
| Noise entropy rate | **79 bits/s** |
| Mutual information rate | **78 bits/s** |
| Information per spike | **약 1.8 bits/spike** |

$$
\boxed{
\mathcal I=157-79=78\;\mathrm{bits/s}
}
$$

이 수치는 특정 stimulus, 기록, 반복 시행과 시간 해상도의 결과다. **모든 뉴런이 언제나 1.8 bits/spike를 전달한다는 뜻은 아니다.**

---

## 9. Homogeneous Poisson spike train의 entropy rate (4.3)

Chapter 1의 Poisson process와 직접 연결해 보자. Rate가 일정한 homogeneous Poisson process의 ISI 분포는

$$
p(\tau)=re^{-r\tau},\qquad\tau\ge0
$$

이다. ISI를 시간 해상도 $\Delta\tau$로 측정한다면 interval 하나의 entropy는 충분히 작은 $\Delta\tau$에서

$$
\begin{aligned}
H_{\mathrm{ISI}}
&\approx-\int_0^\infty p(\tau)\log_2[p(\tau)\Delta\tau]\,d\tau\\
&=-\frac1{\ln2}\left[\ln(r\Delta\tau)-r\mathbb E[\tau]\right].
\end{aligned}
$$

Poisson process에서는 $\mathbb E[\tau]=1/r$이므로

$$
\boxed{
H_{\mathrm{ISI}}
=\frac{1-\ln(r\Delta\tau)}{\ln2}
}
$$

이다. 평균적으로 1초당 $r$개의 interval이 있으므로 **ISI가 독립인 Poisson process**에 대해

$$
\boxed{
\dot H
=\frac{r}{\ln2}\left[1-\ln(r\Delta\tau)\right]
}
\tag{4.53}
$$

를 얻는다.

ISI들이 서로 의존하는 일반적인 spike train에서는 **ISI marginal distribution만으로 계산한 위와 같은 값은 실제 entropy rate의 상한**이 될 수 있다.

또한 **spike-train entropy rate와 stimulus에 관한 mutual information rate는 다르다.** 자극과 독립적으로 생성된 Poisson spike train은 불규칙하여 entropy가 높아도 stimulus 정보는 전달하지 않을 수 있다.

---

## 10. 부록: KL divergence가 0 이상인 이유 (4.5)

Chapter 4의 부록은 Jensen inequality로 KL divergence의 비음수성을 유도한다.

로그는 오목함수이므로

$$
\mathbb E_P[\log_2 X]\le\log_2\mathbb E_P[X]
$$

이다. $X=Q(x)/P(x)$로 두면

$$
\begin{aligned}
-D_{\mathrm{KL}}(P\|Q)
&=\sum_xP(x)\log_2\frac{Q(x)}{P(x)}\\
&\le\log_2\left(\sum_xP(x)\frac{Q(x)}{P(x)}\right)\\
&=\log_2\sum_xQ(x)=0.
\end{aligned}
$$

따라서

$$
\boxed{D_{\mathrm{KL}}(P\|Q)\ge0}
$$

이다. $Q$가 $P$가 양수인 곳에서 0이라면 KL은 무한대로 정의될 수 있다. 이산적인 경우 두 분포가 같을 때 등호가 성립한다.

앞의 mutual information도 KL divergence이므로

$$
\boxed{I(S;R)\ge0}
$$

라는 성질이 바로 따라온다.

---

## 11. 핵심 수식 한눈에 보기

| 개념 | 대표 수식 | 핵심 의미 |
| --- | --- | --- |
| Self-information | $-\log_2P(r)$ | 드문 사건일수록 놀라움이 큼 |
| Shannon entropy | $H(R)=-\sum P(r)\log_2P(r)$ | 평균적인 불확실성 |
| Mutual information | $I=H(R)-H(R\mid S)$ | 자극에 대한 정보만 추출 |
| KL expression | $I=D_{\mathrm{KL}}(P_{SR}\|P_SP_R)$ | 독립 분포와의 차이 |
| Binary symmetric channel | $I=1-H_2(p_e)$ | 오류율과 정보량 |
| Uniform max-entropy output | $p(r)=1/r_{\max}$ | 제한된 출력 범위의 균등 활용 |
| Histogram equalization | $f(s)=r_{\max}F_S(s)$ | 자극의 CDF에 맞춘 tuning |
| Factorial code | $P(\boldsymbol R)=\prod_aP(R_a)$ | Population의 반응 독립성 |
| Whitening | $|\widetilde D|=\sigma_L/\sqrt{S}$ | 주파수별 출력 power 균등화 |
| Wiener noise filter | $\widetilde D_\eta=S/(S+N)$ | 낮은 SNR 대역의 noise 억제 |
| Spike-word entropy rate | $\dot H=-\sum_BP(B)\log_2P(B)/T_s$ | 시간적 spike pattern의 entropy |
| Information rate | $\mathcal I=\dot H_{\mathrm{total}}-\dot H_{\mathrm{noise}}$ | bits/s |

---

## 12. 이해도 점검 — 질문을 눌러 해설 보기

<details markdown="1">
<summary><strong>Q1. 뉴런이 무작위로 매우 자주 발화하면 반드시 정보량도 높을까?</strong></summary>

아니다. 반응이 다양하면 $H(R)$는 커질 수 있지만, stimulus와 독립이면 $P(s,r)=P(s)P(r)$이므로

$$
I(S;R)=0.
$$

**Entropy와 mutual information을 혼동하지 말자.**

</details>

<details markdown="1">
<summary><strong>Q2. 왜 출력의 최대값이 제한되면 uniform response distribution이 entropy를 최대화할까?</strong></summary>

정규화 조건을 둔 entropy의 변분에서

$$
\frac{\delta\mathcal L}{\delta p(r)}=-(\ln p(r)+1)-\lambda=0
$$

이므로 $\ln p(r)$가 상수다. 따라서 출력 구간 $[0,r_{\max}]$에 대해 $p(r)=1/r_{\max}$가 된다.

**이 결론은 오직 해당 제약과 모델 아래의 결과다.**

</details>

<details markdown="1">
<summary><strong>Q3. 자극이 자주 나타나는 곳에서 tuning curve의 기울기가 커지는 이유는?</strong></summary>

Histogram equalization을 적용하면

$$
f'(s)=r_{\max}p(s)
$$

가 된다. 따라서 $p(s)$가 큰 자극 구간에서는 response range를 더 세밀하게 배분해, 자주 나타나는 자극의 차이를 출력값으로 구별하도록 만든다.

</details>

<details markdown="1">
<summary><strong>Q4. Whitening을 하면 자연 영상의 고주파 noise까지 키울 위험이 있는 이유는?</strong></summary>

Whitening filter는

$$
|\widetilde D(\boldsymbol k)|\propto1/\sqrt{S(\boldsymbol k)}
$$

이므로 자연자극이 약한 주파수를 크게 증폭한다. 그러나 그 주파수에서 noise가 signal보다 크면 유용한 정보가 아니라 noise를 증폭할 수 있다. 이를 막기 위해 $S/(S+N)$ 형태의 noise filter를 함께 사용한다.

</details>

<details markdown="1">
<summary><strong>Q5. Factorial code에서는 왜 두 뉴런의 단순한 복제가 비효율적일까?</strong></summary>

한 뉴런이 다른 뉴런과 완전히 같은 반응을 생성하면 새로운 response uncertainty를 거의 추가하지 못한다.

$$
H(R_1,R_2)\le H(R_1)+H(R_2)
$$

이며 등호는 반응들이 독립일 때만 성립한다. 하지만 **독립적인 random noise만 가진 뉴런들이 자극 정보를 많이 전달하는 것은 아니다**.

</details>

<details markdown="1">
<summary><strong>Q6. Spike-word 길이 Tₛ를 크게 하면 왜 entropy 추정이 어려워질까?</strong></summary>

Bin 크기를 $\Delta t$로 고정하면 가능한 word 수는 최대

$$
2^{T_s/\Delta t}
$$

개로 증가한다. 따라서 충분히 긴 시간 상관을 반영하려면 큰 $T_s$가 필요하지만, finite data에서 모든 word 확률을 추정하기에는 표본이 부족해진다. 교재는 $\dot H$를 $1/T_s\to0$으로 외삽해 문제를 완화한다.

</details>

<details markdown="1">
<summary><strong>Q7. 왜 동일한 자극의 여러 trial이 noise entropy 측정에 필요한가?</strong></summary>

같은 stimulus와 같은 시작 시각에서 발생한 spike word들의 분포 $P(B\mid t)$를 구해야만 **자극 변화 때문이 아니라 trial 자체의 불규칙성 때문에 발생한 entropy**를 추정할 수 있기 때문이다.

</details>

<details markdown="1">
<summary><strong>Q8. Fisher information과 mutual information은 같은 정보를 다른 단위로 측정하는 것인가?</strong></summary>

아니다. Fisher information은 **주어진 자극 주변의 국소적 구분 능력**, mutual information은 **자극 분포 전반에서 반응으로 감소한 불확실성**을 나타낸다. 제한된 조건에서 관계가 생길 수 있지만 일반적으로 동일한 수량이 아니다.

</details>

---

## 13. Chapter 1–4 연결과 학습 포인트

| Chapter | 중심 질문 | 대표 도구 |
| --- | --- | --- |
| 1 — Spike Statistics | 뉴런의 spike를 어떻게 기술하는가? | $\rho(t)$, STA, Poisson |
| 2 — Neural Encoding | 자극에서 반응을 어떻게 예측하는가? | Linear filter, LNP |
| 3 — Neural Decoding | 반응에서 자극을 어떻게 복원하는가? | Bayesian inference, Fisher information |
| 4 — Information Theory | 반응이 자극에 관해 **얼마나 많은 정보를 전달**하는가? | Entropy, MI, efficient coding |

특히 **4.1의 $I(S;R)=H(R)-H(R\mid S)$**, **4.2의 $f(s)=r_{\max}F_S(s)$와 whitening**, **4.3의 spike-word direct method**를 따로 연습해 보자.

BCI에서는 decoding accuracy와 latency뿐 아니라 neural signal에 어떤 정보가 실려 있는지도 중요하다. 이 장의 정보이론은 관측한 spike train이 자극·행동 의도와 얼마나 관계있는지를 정량화하는 중요한 출발점이다.

---

## 참고 자료

- Peter Dayan and L. F. Abbott, *Theoretical Neuroscience: Computational and Mathematical Modeling of Neural Systems*, Chapter 4, **Information Theory**, pp. 123–150.
- [Dayan & Abbott — 원문 PDF (Boulder School/Yale)](https://boulderschool.yale.edu/sites/default/files/files/DayanAbbott.pdf)
- [Dayan & Abbott — 저자 공식 도서 페이지](https://www.gatsby.ucl.ac.uk/~dayan/book/)
- [Chapter 1: Neural Encoding I]({{ '/blog/2026/dayan-abbott-chapter-1/' | relative_url }})
- [Chapter 2: Neural Encoding II]({{ '/blog/2026/dayan-abbott-chapter-2/' | relative_url }})
- [Chapter 3: Neural Decoding]({{ '/blog/2026/dayan-abbott-chapter-3/' | relative_url }})
